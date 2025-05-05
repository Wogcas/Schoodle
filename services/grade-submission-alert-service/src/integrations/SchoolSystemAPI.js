const axios = require('axios');
const { SCHOOL_SYSTEM_URL } = require('../config/constants');

class SchoolSystemAPI {
  constructor() {
    this.instance = axios.create({
      baseURL: SCHOOL_SYSTEM_URL,
      timeout: 8000
    });
  }

  // Nuevo método para obtener información del sistema
  async getSystemInfo() {
    try {
      return await this.instance.get('/info');
    } catch (error) {
      return this.handleError(error);
    }
  }

  handleError(error) {
    return {
      success: false,
      status: error.response?.status || 503,
      error: error.message
    };
  }
}

module.exports = SchoolSystemAPI;