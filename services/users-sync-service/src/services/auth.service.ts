import axios from 'axios';
import config from '../config';

interface AuthUser {
  idNumber: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export const registerAuthUser = async (user: AuthUser): Promise<void> => {
  try {
    await axios.post(`${config.AUTH_SERVICE_URL}/auth/sync/user`, user);
  } catch (error: any) {
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      throw new Error('AUTH_SERVICE_CONNECTION_ERROR');
    }
    throw error;
  }
};