export interface User {
    id?: number;
    idNumber: string | number;
    name: string;
    lastName: string;
    email: string;
    registeredAt: Date;
}

export interface UserWithRole {
  id: number;
  idNumber: string;
  name: string;
  lastName: string;
  email: string;
  registeredAt: Date;
  role: 'Teacher' | 'Tutor' | null;
}