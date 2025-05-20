import axios from 'axios';
import config from '../config';

interface AuthUser {
  idNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export const registerAuthUser = async (user: AuthUser): Promise<void> => {
  try {
    const response = await axios.post(
      `${config.AUTH_SERVICE_URL}/auth/sync/user`,
      user,
      {
        headers: {
          'x-api-key': config.JWT_SECRET,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.status !== 201 && response.status !== 200) {
      throw new Error(`Error en registro: ${response.statusText}`);
    }
  } catch (error: any) {
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      throw new Error('AUTH_SERVICE_CONNECTION_ERROR');
    }
    throw error;
  }
};