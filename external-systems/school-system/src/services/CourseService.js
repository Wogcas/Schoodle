const CourseRepository = require('../repositories/CourseRepository');
const SubjectRepository = require('../repositories/SubjectRepository');

class CourseService {
    async createCourse(courseData) {
        return await CourseRepository.create(courseData);
    }

    async getFullCourseDetails(courseId) {
        const course = await CourseRepository.getFullCourseDetails(courseId);
        if (!course) throw new Error('Curso no encontrado');
        return course;
    }

    async createSubjectWithUnits(subjectData, units) {
        return await SubjectRepository.createWithUnits(subjectData, units);
    }
}

module.exports = new CourseService();