import knex from '../database/knex';

class BaseRepository {
    constructor(private tableName: string) {}
    
    async findAll() {
        return knex(this.tableName).select('*');
    }
    
    async findById(id: number) {
        return knex(this.tableName).where({id}).first();
    }
    
    async create(data: any) {
        const [id] = await knex(this.tableName).insert(data);
        return this.findById(id);
    }
    
    async update(id: number, data: any) {
        await knex(this.tableName).where({id}).update(data);
        return this.findById(id);
    }
    
    async delete(id: number) {
        await knex(this.tableName).where({id}).del();
    }
}