import knex from '../database/knex';
import BaseRepository from './BaseRepository';

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
}