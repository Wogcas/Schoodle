import knex from '../database/knex';
import BaseRepository from './BaseRepository';
import { UserWithRole } from '../models/User';

export default class UserRepository extends BaseRepository {
    constructor() {
        super('Users');
    }

    async getFirstRegisteredUser() {
        return knex('Users')
            .select('*')
            .orderBy('registeredAt', 'asc')
            .first();
    }

    async getUsersRegisteredSince(startDate: Date): Promise<UserWithRole[]> {
        return knex('Users as U')
            .select([
                'U.id',
                'U.idNumber',
                'U.name',
                'U.lastName',
                'U.email',
                'U.registeredAt',
                knex.raw(`
        CASE
          WHEN T.userId IS NOT NULL THEN 'Teacher'
          WHEN TU.userId IS NOT NULL THEN 'Tutor'
          ELSE NULL
        END as role
      `)
            ])
            .leftJoin('Teachers as T', 'U.id', 'T.userId')
            .leftJoin('Tutors as TU', 'U.id', 'TU.userId')
            .where('U.registeredAt', '>=', startDate)
            .andWhere(function () {
                this.whereNotNull('T.userId').orWhereNotNull('TU.userId');
            })
            .orderBy('U.registeredAt', 'asc');
    }
}