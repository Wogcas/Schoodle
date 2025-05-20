import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcListCoursesResponse } from './grpc/course.interface';
import { CourseContentsList, CourseIdRequest } from './grpc/course-content.interface';
import { UserCoursesResponse, UserIdRequest } from './grpc/user-courses.interface';
import { EnrolledUsersRequest, EnrolledUsersResponse } from './grpc/enrolled-users.interface';
import { AssignmentDateRequest, CourseAssignmentsResponse } from './grpc/course-assignments.interface';
import { UserGradesByTypeRequest, UserGradesResponse } from './grpc/user-grades.interface';

@Controller()
export class AppController {

  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @GrpcMethod('MoodleInfoService', 'ListAllCourses')
  async listAllCourses(): Promise<GrpcListCoursesResponse> {
    try {
      const courses = await this.appService.fetchMoodleCourses();
      return { courses };
    } catch (error) {
      throw new Error('Failed to fetch Moodle courses');
    }
  }

  @GrpcMethod('MoodleInfoService', 'GetCourseContents')
  async getCourseContents(data: CourseIdRequest): Promise<CourseContentsList> {
    try {
      const contents = await this.appService.fetchMoodleCourseContents(data.courseid);
      return { contents };
    } catch (error) {
      throw new Error('Failed to fetch Moodle course contents');
    }
  }

  @GrpcMethod('MoodleInfoService', 'GetUserCourses')
  async getUserCourses(data: UserIdRequest): Promise<UserCoursesResponse> {
    try {
      const courses = await this.appService.fetchMoodleUserCourses(data.userid);
      return { courses };
    } catch (error) {
      throw new Error('Failed to fetch user courses');
    }
  }

  @GrpcMethod('MoodleInfoService', 'GetEnrolledUsers')
  async getEnrolledUsers(data: EnrolledUsersRequest): Promise<EnrolledUsersResponse> {
    try {
      const users = await this.appService.fetchEnrolledUsers(data.courseid);
      return { users };
    } catch (error) {
      throw new Error('Failed to fetch enrolled users');
    }
  }

  @GrpcMethod('MoodleInfoService', 'GetCourseAssignments')
  async getCourseAssignments(data: CourseIdRequest): Promise<CourseAssignmentsResponse> {
    try {
      const assignments = await this.appService.fetchCourseAssignments(data.courseid);
      return { assignments };
    } catch (error) {
      this.logger.error(`Failed to fetch assignments for course ${data.courseid}:`, error.stack);
      throw new error('Failed to fetch course assignments');
    }
  }

  @GrpcMethod('MoodleInfoService', 'GetAssignmentsBetweenDates')
  async getAssignmentsBetweenDates(data: AssignmentDateRequest): Promise<CourseAssignmentsResponse> {
    try {
      const assignments = await this.appService.fetchAssignmentsBetweenDates(
        data.courseid,
        data.startdate,
        data.enddate
      );
      return { assignments };
    } catch (error) {
      this.logger.error(`Failed to fetch assignments between dates for course ${data.courseid}:`, error.stack);
      throw new Error('Failed to fetch assignments between dates');
    }
  }

  @GrpcMethod('MoodleInfoService', 'GetUserGradesByType')
  async getUserGradesByType(data: UserGradesByTypeRequest): Promise<UserGradesResponse> {
    try {
      this.logger.log(`Fetching ${data.gradeitem} grades for user ${data.userid} in course ${data.courseid}`);
      return await this.appService.fetchUserGradesByType(
        data.courseid,
        data.userid,
        data.gradeitem
      );
    } catch (error) {
      this.logger.error(`Failed to fetch user grades by type:`, error.stack);
      throw new Error('Failed to fetch user grades by type');
    }
  }

}
