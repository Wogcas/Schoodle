const knex = require('../database/knex');

class CourseRepository {
    async create(courseData) {
        const [course] = await knex('Courses').insert(courseData).returning('*');
        return course;
    }

    async getFullCourseDetails(courseId) {
        const course = await knex('Courses')
            .where('Courses.id', courseId)
            .join('Subjects', 'Courses.subjectId', 'Subjects.id')
            .join('Teachers', 'Courses.teacherId', 'Teachers.id')
            .first()
            .select('Courses.*', 'Subjects.name as subjectName', 'Teachers.name as teacherName');

        const units = await knex('Units').where({ subjectId: course.subjectId });
        const students = await knex('CourseTaken')
            .where({ courseId })
            .join('Students', 'CourseTaken.studentId', 'Students.id')
            .select('Students.*', 'CourseTaken.generalScore');

        return {
            ...course,
            units,
            students
        };
    }
}

module.exports = new CourseRepository();