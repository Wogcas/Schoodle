import knex from '../database/knex';
import BaseRepository from './sex';

export default class SchoolTermRepository extends BaseRepository {
    constructor() {
        super('SchoolTerms');
    }

    async getLatestSchoolTerm() {
        return knex('SchoolTerms')
            .select('*')
            .orderBy('termStartDate', 'desc')
            .first();
    }

    async getSchoolTermById(termId: number) {
        return knex('SchoolTerms')
            .select('*')
            .where('id', termId)
            .first();
    }
}