import knex from '../database/knex';

import Student from '../models/Student';
import BaseRepository from './BaseRepository';

interface CourseWithTeacher {
    courseIdNumber: string;
    courseName: string;
    teacherIdNumber: string;
    teacherName: string;
    teacherLastName: string;
}

interface StudentInfo {
    studentIdNumber: string;
    studentName: string;
    studentLastName: string;
}

export default class StudentRepository extends BaseRepository {
    constructor() {
        super('Students');
    }

    async getStudentsByTutorIdNumber(tutorIdNumber: string): Promise<Student[]> {
        return knex('Users as UT')
            .select({
                id: 'US.id',
                idNumber: 'US.idNumber',
                name: 'US.name',
                lastName: 'US.lastName',
                email: 'US.email',
                registeredAt: 'US.registeredAt'  // Campo añadido
            })
            .innerJoin('Tutors as T', 'UT.id', 'T.userId')
            .innerJoin('TutorsStudents as TS', 'T.userId', 'TS.tutorId')
            .innerJoin('Students as S', 'TS.studentId', 'S.userId')
            .innerJoin('Users as US', 'S.userId', 'US.id')
            .where('UT.idNumber', tutorIdNumber);
    };

    async getStudentCurrentCourses(idNumber: string): Promise<{
        courses: Array<{
            idNumber: string;
            name: string;
            teacher: {
                idNumber: string;
                name: string;
            }
        }>;
        student: {
            idNumber: string;
            name: string;
        }
    }> {
        const student = await knex('Users as U')
            .select({
                idNumber: 'U.idNumber',
                name: 'U.name',
                lastName: 'U.lastName'
            })
            .innerJoin('Students as S', 'U.id', 'S.userId')
            .where('U.idNumber', idNumber)
            .first();

        if (!student) {
            throw new Error('Student not found');
        }

        const courses = await knex('Users as U')
            .select({
                courseIdNumber: 'C.idnumber',
                courseName: 'C.name',
                teacherIdNumber: 'UT.idNumber',
                teacherName: knex.raw('CONCAT("Prof. ", UT.name, " ", UT.lastName)'),
            })
            .innerJoin('Students as S', 'U.id', 'S.userId')
            .innerJoin('EnrolledTerms as ET', 'S.userId', 'ET.studentId') 
            .innerJoin('SchoolTerms as ST', 'ET.schoolTermId', 'ST.id')
            .innerJoin('CourseTaken as CT', 'ET.id', 'CT.enrolledTermId')
            .innerJoin('Course as C', 'CT.courseId', 'C.id')
            .innerJoin('Teachers as T', 'C.teacherId', 'T.userId')
            .innerJoin('Users as UT', 'T.userId', 'UT.id')
            .where('U.idNumber', idNumber)
            .andWhere('ST.termStartDate', '<=', knex.fn.now())
            .andWhere('ST.termEndDate', '>=', knex.fn.now())
            .groupBy(['C.id', 'UT.id']);

            
        return {
            courses: courses.map(course => ({
                idNumber: course.courseIdNumber,
                name: course.courseName,
                teacher: {
                    idNumber: course.teacherIdNumber,
                    name: course.teacherName
                }
            })),
            student: {
                idNumber: student.idNumber,
                name: `${student.name} ${student.lastName}`
            }
        };

    }

}