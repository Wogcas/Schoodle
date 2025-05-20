import axios from 'axios';
import config from '../config';

export interface SchoolUser {
  id: number;
  idNumber: string;
  name: string;
  lastName: string;
  email: string;
  registeredAt: string;
  role?: string;
}

export const getOldestRegisteredUser = async (): Promise<SchoolUser> => {
  try {
    const response = await axios.get<SchoolUser>(`${config.SCHOOL_SYSTEM_URL}/api/school-system/users/first-registered`);
    return response.data;
  } catch (error: any) {
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      throw new Error('SCHOOL_SYSTEM_CONNECTION_ERROR');
    }
    throw error;
  }
};


export const getUsersRegisteredSince = async (since: Date): Promise<SchoolUser[]> => {
  try {
    const response = await axios.get<SchoolUser[]>(`${config.SCHOOL_SYSTEM_URL}/api/school-system/users/registered-since`, {
      params: { since: since.toISOString() }
    });
    return response.data;
  } catch (error: any) {
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      throw new Error('SCHOOL_SYSTEM_CONNECTION_ERROR');
    }
    throw error;
  }
};