import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { plainToClass, plainToInstance } from 'class-transformer';
import { SiteInfoDTO } from './dtos/site-info.dto';
import { enviroment } from './config/enviroment.config';
import { CourseDTO } from './dtos/course.dto';
import { MapperService } from './mapper/mapper.service';
import { CourseContentDTO } from './dtos/course-content.dto';
import { GrpcCourse } from './grpc/course.interface';
import { GrpcCourseSection } from './grpc/course-content.interface';
import { UserCourse } from './grpc/user-courses.interface';
import { EnrolledUser } from './grpc/enrolled-users.interface';
import { CourseAssignment } from './grpc/course-assignments.interface';

@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly mapperService: MapperService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async fetchMoodleSiteInfo(): Promise<SiteInfoDTO> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('/site-info'),
      );
      return plainToClass(SiteInfoDTO, response.data);
    } catch (error) {
      throw new Error('Couldnt fetch Moodle site info');
    }
  }

  async fetchMoodleCourses(): Promise<GrpcCourse[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('/courses'),
      );
      return this.mapperService.mapCourses(response.data);
    } catch (error) {
      this.logger.error('Error fetching courses', error);
      throw error;
    }
  }

  async fetchMoodleCourseContents(courseid: number): Promise<GrpcCourseSection[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`/courses/${courseid}/contents`)
      );
      return this.mapperService.mapCourseContents(response.data);
    } catch (error) {
      this.logger.error('Error fetching contents', error);
      throw error;
    }
  }

  async fetchMoodleUserCourses(userid: number): Promise<UserCourse[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`/courses/${userid}`)
      );
      return this.mapperService.mapUserCourses(response.data);
    } catch (error) {
      this.logger.error('Error fetching user courses', error);
      throw error;
    }
  }

  async fetchEnrolledUsers(courseid: number): Promise<EnrolledUser[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`/enrolled-users/${courseid}`)
      );
      return this.mapperService.mapEnrolledUsers(response.data);
    } catch (error) {
      this.logger.error(`Error fetching enrolled users for course ${courseid}:`, error);
      throw error;
    }
  }

  async fetchCourseAssignments(courseid: number): Promise<CourseAssignment[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`/assignments/${courseid}`)
      );
      return this.mapperService.mapCourseAssignments(response.data);
    } catch (error) {
      this.logger.error(`Error fetching assignments for course ${courseid}:`, error);
      throw error;
    }
  }











  
}
