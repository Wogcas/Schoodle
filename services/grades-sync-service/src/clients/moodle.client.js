const axios = require('axios');
const { moodle } = require('../config/externalSystems');

const moodleClient = axios.create({
    baseURL: moodle.baseURL,
    timeout: 5000
});

module.exports = {
    getSiteInfo: async () => {
        try {
            const response = await moodleClient.get('/site-info');
            return response.data;
        } catch (error) {
            throw new Error(`Mooodle connection failed: ${error.message}`);
        }
    }
}