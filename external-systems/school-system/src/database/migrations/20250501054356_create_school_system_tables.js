/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema
    // 1. Tabla base de usuarios
    .createTable('Users', (table) => {
      table.increments('id').primary();
      table.string('idNumber').notNullable().unique();
      table.string('name').notNullable();
      table.string('lastName').notNullable();
      table.string('email').notNullable().unique();
      table.timestamp('registeredAt').defaultTo(knex.fn.now());
    })

    // 2. Tablas de roles (creadas en orden de dependencia)
    .createTable('Teachers', (table) => {
      table.integer('userId').unsigned().primary().references('id').inTable('Users');
      table.string('phoneNumber', 20).notNullable(); // Para Teachers
    })
    .createTable('Tutors', (table) => {
      table.integer('userId').unsigned().primary().references('id').inTable('Users');
      table.string('phoneNumber', 20).notNullable(); // Añadido para Tutors
    })
    .createTable('Students', (table) => {
      table.integer('userId').unsigned().primary().references('id').inTable('Users');
    })

    // 3. Tablas independientes
    .createTable('SchoolTerms', (table) => {
      table.increments('id').primary();
      table.date('termStartDate').notNullable();
      table.date('termEndDate').notNullable();
    })

    // 4. Tablas con dependencias
    .createTable('EnrolledTerms', (table) => {
      table.increments('id').primary();
      table.integer('studentId').unsigned().notNullable().references('userId').inTable('Students');
      table.integer('schoolTermId').unsigned().notNullable().references('id').inTable('SchoolTerms');
      table.float('gradeScore');
      table.unique(['studentId', 'schoolTermId']);
    })
    .createTable('Course', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('idnumber').notNullable().unique();
      table.integer('teacherId').unsigned().notNullable().references('userId').inTable('Teachers');
    })
    .createTable('CourseTaken', (table) => {
      table.increments('id').primary();
      table.integer('enrolledTermId').unsigned().notNullable().references('id').inTable('EnrolledTerms');
      table.integer('courseId').unsigned().notNullable().references('id').inTable('Course');
      table.float('score').notNullable();
      table.unique(['enrolledTermId', 'courseId']);
    })
    .createTable('TutorsStudents', (table) => {
      table.increments('id').primary();
      table.integer('tutorId').unsigned().notNullable().references('userId').inTable('Tutors'); // Corregido FK tutorial → tutorId
      table.integer('studentId').unsigned().notNullable().references('userId').inTable('Students');
      table.unique(['tutorId', 'studentId']);
    })
    .createTable('GradeSubmissionViolations', (table) => {
      table.increments('id').primary();
      table.integer('teacherId').unsigned().notNullable().references('userId').inTable('Teachers');
      table.date('violationDate').notNullable();
    })
    .createTable('SubmissionViolations', (table) => {
      table.increments('id').primary();
      table.integer('GradeSubmissionViolationId').unsigned().notNullable().references('id').inTable('GradeSubmissionViolations');
      table.integer('CourseTakenId').unsigned().notNullable().references('id').inTable('CourseTaken');
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
    .dropTableIfExists('TutorsStudents')
    .dropTableIfExists('CourseTaken')
    .dropTableIfExists('Course')
    .dropTableIfExists('EnrolledTerms')
    .dropTableIfExists('SchoolTerms')
    .dropTableIfExists('Students')
    .dropTableIfExists('Tutors') // Añadido
    .dropTableIfExists('Teachers')
    .dropTableIfExists('Users');
};