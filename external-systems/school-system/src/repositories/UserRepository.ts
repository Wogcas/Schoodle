import knex from '../database/knex';
import BaseRepository from './BaseRepository';

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
}