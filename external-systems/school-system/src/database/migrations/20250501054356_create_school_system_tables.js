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
      })
      .createTable('Students', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('lastName').notNullable();
        table.date('birthDate').notNullable();
        table.string('email').notNullable().unique();
      })
      .createTable('TutorsStudents', (table) => {
        table.increments('id').primary();
        table.integer('tutorId').unsigned().notNullable().references('id').inTable('Tutors');
        table.integer('studentId').unsigned().notNullable().references('id').inTable('Students');
        table.unique(['tutorId', 'studentId']);
      })
      .createTable('GradeGroup', (table) => {
        table.increments('id').primary();
        table.integer('studentId').unsigned().references('id').inTable('Students');
        table.string('currentGrade', 50).notNullable();
        table.string('group', 50).notNullable();
      })
      .createTable('Teachers', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('lastName').notNullable();
        table.date('birthDate').notNullable();
        table.string('email').notNullable().unique();
        table.string('phoneNumber', 20);
      })
      .createTable('Subjects', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable().unique();
      })
      // Tablas académicas
      .createTable('AcademicTerms', (table) => {
        table.increments('id').primary();
        table.integer('studentId').unsigned().references('id').inTable('Students');
        table.date('termStartDate').notNullable();
        table.float('gradeScore');
        table.string('gradeTaken', 50);
      })
      .createTable('Courses', (table) => {
        table.increments('id').primary();
        table.integer('subjectId').unsigned().references('id').inTable('Subjects');
        table.integer('teacherId').unsigned().references('id').inTable('Teachers');
      })
      .createTable('StudentsCourses', (table) => {
        table.increments('id').primary();
        table.integer('studentId').unsigned().references('id').inTable('Students');
        table.integer('courseId').unsigned().references('id').inTable('Courses');
        table.unique(['studentId', 'courseId']);
      })
      // Sistema de calificaciones
      .createTable('CourseScores', (table) => {
        table.increments('id').primary();
        table.float('generalScore').notNullable();
      })
      .createTable('CourseTaken', (table) => {
        table.increments('id').primary();
        table.integer('academicTermId').unsigned().references('id').inTable('AcademicTerms');
        table.integer('courseId').unsigned().references('id').inTable('Courses');
        table.integer('courseScoresId').unsigned().references('id').inTable('CourseScores');
      })
      .createTable('Units', (table) => {
        table.increments('id').primary();
        table.integer('subjectId').unsigned().references('id').inTable('Subjects');
        table.string('name').notNullable();
        table.float('contributionPercentage').notNullable(); // Nota: "Contribution" con "r"
      })
      .createTable('CourseScoresUnits', (table) => {
        table.increments('id').primary();
        table.integer('courseScoresId').unsigned().references('id').inTable('CourseScores');
        table.integer('unitId').unsigned().references('id').inTable('Units');
        table.float('score').notNullable();
        table.unique(['courseScoresId', 'unitId']);
      });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function(knex) {
    await knex.schema
      .dropTableIfExists('CourseScoresUnits')
      .dropTableIfExists('Units')
      .dropTableIfExists('CourseTaken')
      .dropTableIfExists('CourseScores')
      .dropTableIfExists('StudentsCourses')
      .dropTableIfExists('Courses')
      .dropTableIfExists('AcademicTerms')
      .dropTableIfExists('Subjects')
      .dropTableIfExists('Teachers')
      .dropTableIfExists('GradeGroup')
      .dropTableIfExists('TutorsStudents')
      .dropTableIfExists('Students')
      .dropTableIfExists('Tutors');
  };