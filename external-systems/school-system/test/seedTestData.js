const knex = require('../src/database/knex').default;

// Helpers
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
  { name: 'Juan', lastName: 'Pérez', idNumber: 'TCH-001' },
  { name: 'María', lastName: 'García', idNumber: 'TCH-002' },
  { name: 'Carlos', lastName: 'Rodríguez', idNumber: 'TCH-003' }
];

const STUDENTS = Array.from({ length: 50 }, (_, i) => ({
  name: `Estudiante${i + 1}`,
  lastName: `Apellido${i + 1}`,
  idNumber: `STU-${(i + 1).toString().padStart(4, '0')}`,
  birthDate: `200${Math.floor(i / 20)}-01-01`
}));

const TUTORS = Array.from({ length: 15 }, (_, i) => ({
  name: `Tutor${i + 1}`,
  lastName: `ApellidoT${i + 1}`,
  idNumber: `TUT-${(i + 1).toString().padStart(4, '0')}`,
  phoneNumber: `555-${(1000 + i).toString().slice(1)}`
}));

const COURSES = [
  { name: 'Matemáticas Básicas', idNumber: 'MATH-101' },
  { name: 'Física Fundamental', idNumber: 'PHYS-101' },
  { name: 'Programación I', idNumber: 'PROG-101' }
];

async function seed() {
  try {
    await knex.transaction(async trx => {
      // 1. Insertar periodos escolares
      console.log('Insertando periodos...');
      await trx('SchoolTerms').insert(SCHOOL_TERMS.map(term => ({
        termStartDate: term.start,
        termEndDate: term.end
      })));

      // 2. Insertar usuarios y roles
      console.log('Creando profesores...');
      const teachers = [];
      for (const teacher of TEACHERS) {
        const [userId] = await trx('Users').insert({
          idNumber: teacher.idNumber,
          name: teacher.name,
          lastName: teacher.lastName,
          email: generateEmail(teacher.name, teacher.lastName),
          registeredAt: knex.fn.now()
        });
        
        await trx('Teachers').insert({
          userId: userId,
          phoneNumber: '555-0000'
        });
        
        teachers.push({ userId, ...teacher });
      }

      console.log('Creando estudiantes...');
      const students = [];
      for (const student of STUDENTS) {
        const [userId] = await trx('Users').insert({
          idNumber: student.idNumber,
          name: student.name,
          lastName: student.lastName,
          email: generateEmail(student.name, student.lastName),
          registeredAt: knex.fn.now()
        });
        
        await trx('Students').insert({ userId });
        students.push({ userId, ...student });
      }

      console.log('Creando tutores...');
      const tutors = [];
      for (const tutor of TUTORS) {
        const [userId] = await trx('Users').insert({
          idNumber: tutor.idNumber,
          name: tutor.name,
          lastName: tutor.lastName,
          email: generateEmail(tutor.name, tutor.lastName),
          registeredAt: knex.fn.now()
        });
        
        await trx('Tutors').insert({
          userId: userId,
          phoneNumber: tutor.phoneNumber
        });
        
        tutors.push({ userId, ...tutor });
      }

      // 3. Asignar tutores a estudiantes
      console.log('Asignando tutores...');
      const tutorAssignments = [];
      students.forEach((student, index) => {
        const tutor = tutors[index % tutors.length];
        tutorAssignments.push({
          tutorId: tutor.userId,
          studentId: student.userId
        });
      });
      await trx('TutorsStudents').insert(tutorAssignments);

      // 4. Crear cursos
      console.log('Creando cursos...');
      const courses = [];
      for (const course of COURSES) {
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];
        const [courseId] = await trx('Course').insert({
          name: course.name,
          idnumber: course.idNumber,
          teacherId: teacher.userId
        });
        courses.push({ courseId, ...course });
      }

      // 5. Inscribir estudiantes en periodos
      console.log('Inscribiendo en periodos...');
      const schoolTerms = await trx('SchoolTerms').select('*');
      const enrollments = [];
      
      for (const student of students) {
        const term = schoolTerms[Math.floor(Math.random() * schoolTerms.length)];
        const [enrollmentId] = await trx('EnrolledTerms').insert({
          studentId: student.userId,
          schoolTermId: term.id,
        });
        enrollments.push({ enrollmentId, studentId: student.userId });
      }

      // 6. Inscribir en cursos
      console.log('Registrando cursos tomados...');
      const courseTakens = [];
      for (const enrollment of enrollments) {
        const course = courses[Math.floor(Math.random() * courses.length)];
        const [courseTakenId] = await trx('CourseTaken').insert({
          enrolledTermId: enrollment.enrollmentId,
          courseId: course.courseId,
          score: randomGrade()
        });
        courseTakens.push({ courseTakenId, enrollmentId: enrollment.enrollmentId });
      }

      // 7. Generar reportes de violaciones
      console.log('Generando violaciones...');
      const violations = [];
      for (let i = 0; i < 10; i++) {
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];
        const [violationId] = await trx('GradeSubmissionViolations').insert({
          teacherId: teacher.userId,
          violationDate: knex.fn.now()
        });
        violations.push({ violationId });
      }

      // 8. Vincular violaciones con cursos
      console.log('Vinculando violaciones...');
      for (const violation of violations) {
        const courseTaken = courseTakens[Math.floor(Math.random() * courseTakens.length)];
        await trx('SubmissionViolations').insert({
          GradeSubmissionViolationId: violation.violationId,
          CourseTakenId: courseTaken.courseTakenId
        });
      }
    });

    console.log('✅ Datos de prueba insertados correctamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seed();