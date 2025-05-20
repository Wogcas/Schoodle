import { Observable } from "rxjs";
import { GrpcCourse } from "./course.interface";
import { CourseContentsList, CourseIdRequest } from "./course-content.interface";
import { UserGradesByTypeRequest, UserGradesResponse } from "./user-grades.interface";
import { UserCoursesResponse, UserIdRequest } from "./user-courses.interface";
import { EnrolledUsersRequest, EnrolledUsersResponse } from "./enrolled-users.interface";
import { AssignmentDateRequest, CourseAssignmentsResponse } from "./course-assignments.interface";

export interface GrpcMoodleInterface {
  ListAllCourses(data: {}): Observable<{ courses: GrpcCourse[] }>;
  GetCourseContents(data: CourseIdRequest): Observable<CourseContentsList>;
  GetUserCourses(data: UserIdRequest): Observable<UserCoursesResponse>;
  GetEnrolledUsers(data: EnrolledUsersRequest): Observable<EnrolledUsersResponse>;
  GetCourseAssignments(data: CourseIdRequest): Observable<CourseAssignmentsResponse>;
  GetAssignmentsBetweenDates(data: AssignmentDateRequest): Observable<CourseAssignmentsResponse>; 
  GetUserGradesByType(data: UserGradesByTypeRequest): Observable<UserGradesResponse>;
}