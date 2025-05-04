/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema
    // Tablas base
    .createTable('Tutors', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('lastName').notNullable(); // Corregido de isstName
      table.string('email').notNullable().unique();
      table.string('phoneNumber', 20);
    })
    .createTable('Students', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('lastName').notNullable(); // Corregido de isstName
      table.date('birthDate').notNullable();
      table.string('email').notNullable().unique();
    })
    // Ciclos escolares
    .createTable('SchoolTerms', (table) => {
      table.increments('id').primary();
      table.date('termStartDate').notNullable();
      table.date('termEndDate').notNullable();
    })
    // Inscripciones a ciclos
    .createTable('EnrolledTerms', (table) => {
      table.increments('id').primary();
      table.integer('studentId').unsigned().notNullable().references('id').inTable('Students').onDelete('CASCADE');
      table.integer('schoolTermId').unsigned().notNullable().references('id').inTable('SchoolTerms');
      table.string('gradeTaken', 50).notNullable(); // Ej: "Primer Grado"
      table.float('gradeScore'); // Promedio del ciclo
      table.unique(['studentId', 'schoolTermId']);
    })
    // Grupos y grados
    .createTable('GradeGroup', (table) => {
      table.increments('id').primary();
      table.integer('studentId').unsigned().notNullable().references('id').inTable('Students').onDelete('CASCADE');
      table.string('currentGrade', 50).notNullable();
      table.string('group', 10).notNullable();
      table.unique(['studentId']);
    })
    .createTable('Teachers', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('lastName').notNullable();
      table.date('birthDate').notNullable();
      table.string('email').notNullable().unique();
      table.string('phoneNumber', 20);
    })
    // Materias y cursos
    .createTable('Subjects', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
    })
    .createTable('Courses', (table) => {
      table.increments('id').primary();
      table.integer('subjectId').unsigned().notNullable().references('id').inTable('Subjects');
      table.integer('teacherId').unsigned().notNullable().references('id').inTable('Teachers');
    })
    // Cursos tomados
    .createTable('CourseTaken', (table) => {
      table.increments('id').primary();
      table.integer('enrolledTermId').unsigned().notNullable().references('id').inTable('EnrolledTerms').onDelete('CASCADE');
      table.integer('courseId').unsigned().notNullable().references('id').inTable('Courses');
      table.float('generalScore').notNullable();
      table.unique(['enrolledTermId', 'courseId']);
    })
    // Unidades y calificaciones
    .createTable('Units', (table) => {
      table.increments('id').primary();
      table.integer('subjectId').unsigned().notNullable().references('id').inTable('Subjects');
      table.string('name').notNullable();
      table.float('contributionPercentage').notNullable();
    })
    .createTable('CourseTakenUnits', (table) => {
      table.increments('id').primary();
      table.integer('courseTakenId').unsigned().notNullable().references('id').inTable('CourseTaken').onDelete('CASCADE');
      table.integer('unitId').unsigned().notNullable().references('id').inTable('Units');
      table.float('score').notNullable();
      table.unique(['courseTakenId', 'unitId']);
    })
    // Sistema de reportes
    .createTable('GradeSubmissionViolations', (table) => {
      table.increments('id').primary();
      table.integer('teacherId').unsigned().notNullable().references('id').inTable('Teachers');
      table.date('violationDate').notNullable();
    })
    .createTable('SubmissionViolations', (table) => {
      table.increments('id').primary();
      table.integer('violationId').unsigned().notNullable().references('id').inTable('GradeSubmissionViolations').onDelete('CASCADE');
      table.integer('courseTakenUnitId').unsigned().notNullable().references('id').inTable('CourseTakenUnits');
      table.unique(['violationId', 'courseTakenUnitId']);
    })
    // Relación TutorsStudents
    .createTable('TutorsStudents', (table) => {
      table.increments('id').primary();
      table.integer('tutorId').unsigned().notNullable().references('id').inTable('Tutors').onDelete('CASCADE');
      table.integer('studentId').unsigned().notNullable().references('id').inTable('Students').onDelete('CASCADE');
      table.unique(['tutorId', 'studentId']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema
    .dropTableIfExists('SubmissionViolations')
    .dropTableIfExists('GradeSubmissionViolations')
    .dropTableIfExists('CourseTakenUnits')
    .dropTableIfExists('Units')
    .dropTableIfExists('CourseTaken')
    .dropTableIfExists('Courses')
    .dropTableIfExists('Subjects')
    .dropTableIfExists('EnrolledTerms')
    .dropTableIfExists('SchoolTerms')
    .dropTableIfExists('Teachers')
    .dropTableIfExists('GradeGroup')
    .dropTableIfExists('TutorsStudents')
    .dropTableIfExists('Students')
    .dropTableIfExists('Tutors');
};