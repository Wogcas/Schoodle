import knex from '../database/knex';
import Course from '../models/Course';
import BaseRepository from './BaseRepository';

export class CourseRepository extends BaseRepository {
    constructor() {
        super('Courses');
    }
    async getCoursesByTerm(termId: number): Promise<Course[]> {
        return knex('SchoolTerms as ST')
            .select([
                'C.id',
                'C.name',
                'C.idNumber'
            ])
            .innerJoin('EnrolledTerms as ET', 'ST.id', 'ET.schoolTermId')
            .innerJoin('CourseTaken as CT', 'ET.id', 'CT.enrolledTermId')
            .innerJoin('Course as C', 'CT.courseId', 'C.id')
            .where('ST.id', termId)
            .groupBy('C.id')
            .orderBy('C.name', 'asc');
    }
}