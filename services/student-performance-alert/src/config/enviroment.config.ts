import * as dotenv from 'dotenv';

dotenv.config();

export const enviroment = {
    apimoodle: process.env.API_MOODLE_URL || 'http://localhost:8080/api/moodle/rest',
}
