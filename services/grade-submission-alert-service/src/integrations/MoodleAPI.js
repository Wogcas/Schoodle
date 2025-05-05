const axios = require('axios');
const { MOODLE_URL } = require('../config/constants');

class MoodleAPI {
  constructor() {
    this.instance = axios.create({
      baseURL: MOODLE_URL,
      timeout: 10000
    });
  }

  // Nuevo método para obtener información del sitio
  async getSiteInfo() {
    try {
      return await this.instance.get('/site-info');
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

module.exports = MoodleAPI;