const axios = require('axios');
const { schoolSystem } = require('../config/externalSystems');

const schoolSystemClient = axios.create({
    baseURL: schoolSystem.baseURL,
    timeout: 5000
});

module.exports = {
    getInfo: async () => {
        try {
            const response = await schoolSystemClient.get('/info');
            return response.data;
        } catch (error) {
            throw new Error(`School System connection failed: ${error.message}`);
        }
    },
}