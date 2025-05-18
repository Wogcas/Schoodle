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
      table.string('lastName').notNullable();
      table.string('email').notNullable().unique();
      table.string('phoneNumber', 20);
      table.string('idnumber').notNullable().unique();
    })
    .createTable('Students', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('lastName').notNullable();
      table.date('birthDate').notNullable();
      table.string('email').notNullable().unique();
      table.string('idnumber').notNullable().unique();
    })
    // Ciclos escolares
    .createTable('SchoolTerms', (table) => {
      table.increments('id').primary();
      table.date('termStartDate').notNullable();
      table.date('termEndDate').notNullable();
    })
    // Inscripciones
    .createTable('EnrolledTerms', (table) => {
      table.increments('id').primary();
      table.integer('studentId').unsigned().notNullable().references('id').inTable('Students').onDelete('CASCADE');
      table.integer('schoolTermId').unsigned().notNullable().references('id').inTable('SchoolTerms');
      table.string('gradeTaken', 50).notNullable();
      table.float('gradeScore');
      table.unique(['studentId', 'schoolTermId']);
    })
    // Grupos académicos
    .createTable('GradeGroup', (table) => {
      table.increments('id').primary();
      table.integer('studentId').unsigned().notNullable().references('id').inTable('Students').onDelete('CASCADE');
      table.string('currentGrade', 50).notNullable();
      table.string('group', 10).notNullable();
      table.unique(['studentId']);
    })
    // Profesores
    .createTable('Teachers', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('lastName').notNullable();
      table.date('birthDate').notNullable();
      table.string('email').notNullable().unique();
      table.string('phoneNumber', 20);
      table.string('idnumber').notNullable().unique();
    })
    // Cursos
    .createTable('Courses', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('idnumber').notNullable().unique();
      table.integer('teacherId').unsigned().notNullable().references('id').inTable('Teachers');
    })
    // Cursos tomados
    .createTable('CourseTaken', (table) => {
      table.increments('id').primary();
      table.integer('enrolledTermId').unsigned().notNullable().references('id').inTable('EnrolledTerms').onDelete('CASCADE');
      table.integer('courseId').unsigned().notNullable().references('id').inTable('Courses');
      table.float('score').notNullable();
      table.unique(['enrolledTermId', 'courseId']);
    })
    // Sistema de reportes
    .createTable('GradeSubmissionViolations', (table) => {
      table.increments('id').primary();
      table.integer('teacherId').unsigned().notNullable().references('id').inTable('Teachers');
      table.date('violationDate').notNullable();
    })
    .createTable('SubmissionViolations', (table) => {
      table.increments('id').primary();
      table.integer('GradeSubmissionViolationId').unsigned().notNullable().references('id').inTable('GradeSubmissionViolations').onDelete('CASCADE');
      table.integer('CourseTakenId').unsigned().notNullable().references('id').inTable('CourseTaken');
    })
    .createTable('TutorsStudents', (table) => {
      table.increments('id').primary();
      table.integer('tutorId').unsigned().notNullable().references('id').inTable('Tutors').onDelete('CASCADE');
      table.integer('studentId').unsigned().notNullable().references('id').inTable('Students').onDelete('CASCADE');
      table.unique(['tutorId', 'studentId']); // Evita duplicados
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema
    .dropTableIfExists('TutorsStudents')
    .dropTableIfExists('SubmissionViolations')
    .dropTableIfExists('GradeSubmissionViolations')
    .dropTableIfExists('CourseTaken')
    .dropTableIfExists('Courses')
    .dropTableIfExists('EnrolledTerms')
    .dropTableIfExists('SchoolTerms')
    .dropTableIfExists('Teachers')
    .dropTableIfExists('GradeGroup')
    .dropTableIfExists('Students')
    .dropTableIfExists('Tutors');
};