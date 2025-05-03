const knex = require('../src/database/knex');

// Helpers para generar datos
const generateEmail = (name, lastName) => 
  `${name.toLowerCase()}.${lastName.toLowerCase()}@school.com`;

const randomGrade = (min = 60, max = 100) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

// Datos base
const SCHOOL_TERMS = [
  { start: '2023-01-09', end: '2023-06-15' },
  { start: '2023-08-01', end: '2023-12-15' },
  { start: '2024-01-08', end: '2024-06-14' },
];

const SUBJECTS = [
  { 
    name: 'Matemáticas',
    units: [
      { name: 'Álgebra', contributionPercentage: 30 },
      { name: 'Geometría', contributionPercentage: 30 },
      { name: 'Cálculo', contributionPercentage: 40 }
    ]
  },
  {
    name: 'Física',
    units: [
      { name: 'Mecánica', contributionPercentage: 40 },
      { name: 'Termodinámica', contributionPercentage: 30 },
      { name: 'Electromagnetismo', contributionPercentage: 30 }
    ]
  }
];

const TEACHERS = [
  { name: 'Juan', lastName: 'Pérez' },
  { name: 'María', lastName: 'García' },
  { name: 'Carlos', lastName: 'Rodríguez' }
];

const STUDENTS = Array.from({ length: 50 }, (_, i) => ({
  name: `Estudiante${i + 1}`,
  lastName: `Apellido${i + 1}`,
  birthDate: `200${Math.floor(i / 20)}-01-01`,
  email: `estudiante${i + 1}@school.com`
}));

const TUTORS = Array.from({ length: 15 }, (_, i) => ({
  name: `Tutor${i + 1}`,
  lastName: `TutorApellido${i + 1}`,
  email: `tutor${i + 1}@school.com`,
  phoneNumber: `555-100${i.toString().padStart(2, '0')}`
}));

async function seed() {
  try {
    await knex.transaction(async trx => {
      console.log('Insertando periodos escolares...');
      await trx('SchoolTerms').insert(SCHOOL_TERMS.map(t => ({
        termStartDate: t.start,
        termEndDate: t.end
      })));

      console.log('Insertando materias y unidades...');
      const subjects = [];
      for (const subject of SUBJECTS) {
        const [subjectId] = await trx('Subjects').insert({ name: subject.name });
        
        const unitsToInsert = subject.units.map(u => ({
          name: u.name,
          contributionPercentage: u.contributionPercentage,
          subjectId: subjectId
        }));
        
        await trx('Units').insert(unitsToInsert);
        
        subjects.push({ id: subjectId, ...subject });
      }

      console.log('Insertando maestros...');
      const teachers = [];
      for (const teacher of TEACHERS) {
        const [teacherId] = await trx('Teachers').insert({
          ...teacher,
          email: generateEmail(teacher.name, teacher.lastName),
          birthDate: '1980-01-01',
          phoneNumber: '555-0000'
        });
        teachers.push({ id: teacherId, ...teacher });
      }

      console.log('Insertando estudiantes...');
      const students = [];
      for (const student of STUDENTS) {
        const [studentId] = await trx('Students').insert(student);
        students.push({ id: studentId, ...student });
      }

      console.log('Insertando tutores...');
      const tutors = [];
      for (const tutor of TUTORS) {
        const [tutorId] = await trx('Tutors').insert(tutor);
        tutors.push({ id: tutorId, ...tutor });
      }

      console.log('Asignando tutores a estudiantes...');
      const tutorAssignments = [];
      students.forEach((student, index) => {
        const tutor = tutors[index % tutors.length];
        tutorAssignments.push({
          tutorId: tutor.id,
          studentId: student.id
        });
      });
      await trx('TutorsStudents').insert(tutorAssignments);

      console.log('Creando cursos...');
      const courses = [];
      for (const subject of subjects) {
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];
        const [courseId] = await trx('Courses').insert({
          subjectId: subject.id,
          teacherId: teacher.id
        });
        courses.push({ id: courseId, subjectId: subject.id, teacherId: teacher.id });
      }

      console.log('Inscribiendo estudiantes en periodos...');
      const enrollments = [];
      const terms = await trx('SchoolTerms').select('*');
      for (const student of students) {
        const term = terms[Math.floor(Math.random() * terms.length)];
        const [enrollmentId] = await trx('EnrolledTerms').insert({
          studentId: student.id,
          schoolTermId: term.id,
          gradeTaken: `${Math.floor(Math.random() * 3) + 1}ro`
        });
        enrollments.push({ id: enrollmentId, studentId: student.id, schoolTermId: term.id });
      }

      console.log('Inscribiendo estudiantes en cursos...');
      const courseTakens = [];
      for (const enrollment of enrollments) {
          const course = courses[Math.floor(Math.random() * courses.length)];
          // Insertar con valor temporal en generalScore
          const [courseTakenId] = await trx('CourseTaken').insert({
              enrolledTermId: enrollment.id,
              courseId: course.id,
              generalScore: 0 // Valor temporal obligatorio
          });
          courseTakens.push({ 
              id: courseTakenId, 
              enrolledTermId: enrollment.id, 
              courseId: course.id 
          });
      }

      console.log('Generando calificaciones...');
      for (const courseTaken of courseTakens) {
        const course = await trx('Courses').where('id', courseTaken.courseId).first();
        const units = await trx('Units').where('subjectId', course.subjectId);
        
        let generalScore = 0;
        for (const unit of units) {
          const score = randomGrade();
          await trx('CourseTakenUnits').insert({
            courseTakenId: courseTaken.id,
            unitId: unit.id,
            score: score
          });
          generalScore += score * (unit.contributionPercentage / 100);
        }
        
        await trx('CourseTaken')
          .where('id', courseTaken.id)
          .update({ generalScore: generalScore.toFixed(2) });
      }

      console.log('Actualizando promedios de periodos...');
      for (const term of terms) {
        const enrollments = await trx('EnrolledTerms')
          .where('schoolTermId', term.id);
        
        for (const enrollment of enrollments) {
          const courseTakens = await trx('CourseTaken')
            .where('enrolledTermId', enrollment.id);
          
          const average = courseTakens.reduce((acc, ct) => acc + ct.generalScore, 0) / courseTakens.length;
          await trx('EnrolledTerms')
            .where('id', enrollment.id)
            .update({ gradeScore: average.toFixed(2) });
        }
      }
    });

    console.log('✅ Todos los datos de prueba insertados exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error insertando datos:', error);
    process.exit(1);
  }
}

seed();