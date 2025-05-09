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

const TEACHERS = [
  { name: 'Juan', lastName: 'Pérez' },
  { name: 'María', lastName: 'García' },
  { name: 'Carlos', lastName: 'Rodríguez' }
];

const STUDENTS = Array.from({ length: 50 }, (_, i) => ({
  name: `Estudiante${i + 1}`,
  lastName: `Apellido${i + 1}`,
  birthDate: `200${Math.floor(i / 20)}-01-01`,
  email: `estudiante${i + 1}@school.com`,
  idnumber: `STU${(i + 1).toString().padStart(4, '0')}` // Nuevo campo
}));

const TUTORS = Array.from({ length: 15 }, (_, i) => ({
  name: `Tutor${i + 1}`,
  lastName: `TutorApellido${i + 1}`,
  email: `tutor${i + 1}@school.com`,
  phoneNumber: `555-100${i.toString().padStart(2, '0')}`,
  idnumber: `TUT${(i + 1).toString().padStart(4, '0')}` // Nuevo campo
}));

const COURSES = [ // Nueva estructura de cursos
  { name: 'Matemáticas Básicas', idnumber: 'MATH-101' },
  { name: 'Física Fundamental', idnumber: 'PHYS-101' },
  { name: 'Programación I', idnumber: 'PROG-101' }
];

async function seed() {
  try {
    await knex.transaction(async trx => {
      console.log('Insertando periodos escolares...');
      await trx('SchoolTerms').insert(SCHOOL_TERMS.map(t => ({
        termStartDate: t.start,
        termEndDate: t.end
      })));

      console.log('Insertando maestros...');
      const teachers = [];
      for (const teacher of TEACHERS) {
        const [teacherId] = await trx('Teachers').insert({
          ...teacher,
          email: generateEmail(teacher.name, teacher.lastName),
          birthDate: '1980-01-01',
          phoneNumber: '555-0000',
          idnumber: `TCH${teachers.length + 1}`.padStart(7, '0') // Nuevo campo
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
      for (const courseData of COURSES) {
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];
        const [courseId] = await trx('Courses').insert({
          ...courseData,
          teacherId: teacher.id
        });
        courses.push({ id: courseId, ...courseData });
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
        const [courseTakenId] = await trx('CourseTaken').insert({
          enrolledTermId: enrollment.id,
          courseId: course.id,
          score: randomGrade() // Usamos score directamente
        });
        courseTakens.push({ 
          id: courseTakenId, 
          enrolledTermId: enrollment.id, 
          courseId: course.id 
        });
      }

      console.log('Actualizando promedios de periodos...');
      for (const term of terms) {
        const enrollments = await trx('EnrolledTerms')
          .where('schoolTermId', term.id);
        
        for (const enrollment of enrollments) {
          const courseTakens = await trx('CourseTaken')
            .where('enrolledTermId', enrollment.id);
          
          const average = courseTakens.reduce((acc, ct) => acc + ct.score, 0) / courseTakens.length;
          await trx('EnrolledTerms')
            .where('id', enrollment.id)
            .update({ gradeScore: average.toFixed(2) });
        }
      }

      console.log('Generando reportes de violaciones...');
      const violations = [];
      for (let i = 0; i < 10; i++) {
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];
        const [violationId] = await trx('GradeSubmissionViolations').insert({
          teacherId: teacher.id,
          violationDate: '2023-01-01'
        });
        violations.push({ id: violationId });
      }

      console.log('Vinculando violaciones con cursos...');
      for (const violation of violations) {
        const courseTaken = courseTakens[Math.floor(Math.random() * courseTakens.length)];
        await trx('SubmissionViolations').insert({
          GradeSubmissionViolationId: violation.id,
          CourseTakenId: courseTaken.id
        });
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