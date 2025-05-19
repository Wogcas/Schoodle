export interface UserIdRequest {
  userid: number;
}

export interface UserCourse {
  id: number;
  fullname: string;
  displayname: string;
  idnumber: string;
  format: string;
  timemodified: number; 
}

export interface UserCoursesResponse {
  courses: UserCourse[];
}