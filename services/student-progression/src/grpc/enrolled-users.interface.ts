export interface EnrolledUsersRequest {
    courseid: number;
}

export interface UserCourseEnrolled {
    id: number;
    fullname: string;
    shortname: string;
}

export interface UserRole {
    roleid: number;
    shortname: string;
}

export interface EnrolledUser {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    fullname: string;
    email: string;
    enrolledcourses: UserCourseEnrolled[];
    roles: UserRole[];
}

export interface EnrolledUsersResponse {
    users: EnrolledUser[];
}