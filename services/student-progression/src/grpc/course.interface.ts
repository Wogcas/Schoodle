export interface GrpcCourse {
  id: number;
  fullname: string;
  displayname: string;
  idnumber: string;
  format: string;
  timecreated: number; // timestamp
  timemodified: number; // timestamp
}

export interface GrpcListCoursesResponse {
  courses: GrpcCourse[];
}