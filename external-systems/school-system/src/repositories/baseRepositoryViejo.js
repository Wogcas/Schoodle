const knex = require('../database/knex');

class BaseRepository {
  constructor(tableName) {
    this.table = tableName;
  }

  async getAll() {
    return knex(this.table).select("*");
  }
  
  async getById(id) {
    return knex(this.table).where({ id }).first();
  }
  
  async create(data) {
    const [id] = await knex(this.table).insert(data);
    return this.getById(id);
  }

  async update(id, data) {
    await knex(this.table).where({ id }).update(data);
    return this.getById(id);
  }

  async delete(id) {
    return knex(this.table).where({ id }).del();
  }
}

module.exports = BaseRepository;