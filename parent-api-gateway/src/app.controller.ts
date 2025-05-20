import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { MoodleInfoService } from "./services/moodle-info.service";
import { AppService } from "./app.service";

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
    private readonly moodleInfoService: MoodleInfoService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  getMoodleInfo(): string {
    return this.moodleInfoService.getHello();
  }

  @Get('courses')
  async getCourses() {
    return await this.moodleInfoService.listAllCourses();
  }

  @Get('course/:id')
  async getCourseInfo(@Param('id') id: number) {
    return await this.moodleInfoService.getCourseContents(id);
  }

  @Get('student/:id/courses')
  async getStudentCourses(@Param('id') id: number) {
    return await this.moodleInfoService.getStudentCourses(id);
  }

  @Get('course/:id/students')
  async getCourseStudents(@Param('id') id: number) {
    return await this.moodleInfoService.getCourseStudents(id);
  }

  @Get('course/:id/assignments')
  async getCourseAssignments(@Param('id') id: number) {
    return await this.moodleInfoService.getCourseAssignments(id);
  }

  @Get('course/:id/assignments/between/:start/:end')
  async getAssignmentsInBetween(
    @Param('id') id: number,
    @Param('start') start: string,
    @Param('end') end: string
  ) {
    return await this.moodleInfoService.getAssignmentsInBetween(id, start, end);
  }

  @Get('student/:id/course/:courseid/grades/:type')
  async getStudentGradesByType(
    @Param('id') id: number,
    @Param('courseid') courseid: number,
    @Param('type') type: string
  ){
    return await this.moodleInfoService.getUserGradesByType(id, courseid, type);
  }

}
