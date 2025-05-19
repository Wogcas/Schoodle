import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import { SiteInfoDTO } from './dtos/site-info.dto';
import { GrpcListCoursesResponse } from './grpc/course.interface';
import { CourseContentsList, CourseIdRequest, GrpcCourseSection } from './grpc/course-content.interface';
import { UserCoursesResponse, UserIdRequest } from './grpc/user-courses.interface';
import { EnrolledUsersRequest, EnrolledUsersResponse } from './grpc/enrolled-users.interface';
import { CourseAssignmentsResponse } from './grpc/course-assignments.interface';

@Controller()
export class AppController {

  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @GrpcMethod('MoodleInfoService', 'GetSiteInfo')
  async getMoodleInfo(): Promise<SiteInfoDTO> {
    try {
      return await this.appService.fetchMoodleSiteInfo();
    } catch (error) {
      throw new Error('Failed to fetch Moodle site info');
    }
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
      this.logger.log(`Processing request for course ID: ${data.courseid}`);
      const contents = await this.appService.fetchMoodleCourseContents(data.courseid);
      return { contents };
    } catch (error) {
      throw new Error('Failed to fetch Moodle course contents');
    }
  }

  @GrpcMethod('MoodleInfoService', 'GetUserCourses')
  async getUserCourses(data: UserIdRequest): Promise<UserCoursesResponse> {
    try {
      this.logger.log(`Fetching courses for user ID: ${data.userid}`);
      const courses = await this.appService.fetchMoodleUserCourses(data.userid);
      return { courses };
    } catch (error) {
      throw new Error('Failed to fetch user courses');
    }
  }

  @GrpcMethod('MoodleInfoService', 'GetEnrolledUsers')
  async getEnrolledUsers(data: EnrolledUsersRequest): Promise<EnrolledUsersResponse> {
    try {
      this.logger.log(`Fetching enrolled users for course ID: ${data.courseid}`);
      const users = await this.appService.fetchEnrolledUsers(data.courseid);
      return { users };
    } catch (error) {
      throw new Error('Failed to fetch enrolled users');
    }
  }

  @GrpcMethod('MoodleInfoService', 'GetCourseAssignments')
  async getCourseAssignments(data: CourseIdRequest): Promise<CourseAssignmentsResponse> {
    try {
      this.logger.log(`Fetching assignments for course ID: ${data.courseid}`);
      const assignments = await this.appService.fetchCourseAssignments(data.courseid);
      return { assignments };
    } catch (error) {
      this.logger.error(`Failed to fetch assignments for course ${data.courseid}:`, error.stack);
      throw new error('Failed to fetch course assignments');
    }
  }

}
