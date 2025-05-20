export interface GrpcModuleDate {
    label: string;
    timestamp: number; // Unix timestamp
}

export interface GrpcCourseModule {
    id: number;
    name: string;
    dates: GrpcModuleDate[];
}

export interface GrpcCourseSection {
    id: number;
    name: string;
    section: number;
    modules: GrpcCourseModule[];
}

export interface CourseIdRequest {
    courseid: number;
}

export interface CourseContentsList {
    contents: GrpcCourseSection[];
}