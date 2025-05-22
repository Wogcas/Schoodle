import * as dotenv from 'dotenv';

dotenv.config();

export const enviroment = {
        authservice: process.env.AUTH_URL || 'https://localhost:3005/auth',
}
