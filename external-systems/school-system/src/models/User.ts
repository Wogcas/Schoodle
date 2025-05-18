export default interface User {
    id?: number;
    idNumber: string | number;
    name: string;
    lastName: string;
    email: string;
    registeredAt: Date;
}