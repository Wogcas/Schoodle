import { log } from 'console';
import knex from '../database/knex';

import Student from '../models/Student';
import BaseRepository from './BaseRepository';

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
    }
}