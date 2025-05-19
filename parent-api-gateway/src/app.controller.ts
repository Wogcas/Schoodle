import { Controller, Get, Param } from "@nestjs/common";
import { MoodleInfoService } from "./services/moodle-info.service";
import { ParentalApprovalService } from "./services/parental-approval.service";
import { AppService } from "./app.service";



@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
    private readonly moodleInfoService: MoodleInfoService,
    private readonly parentalApprovalService: ParentalApprovalService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  getMoodleInfo(): string {
    return this.moodleInfoService.getHello();
  }

  @Get('course/:id')
  async getCourseInfo(@Param('id') id: number) {
    return await this.moodleInfoService.getCourseContents(id );
  }

  /**
    @Get('moodle')
    async getMoodleInfo() {
      return await this.moodleInfoService.GetSiteInfo({});
    }
  
    @Get('moodle/courses')
    async getMoodleCourses() {
      return await this.moodleInfoService.ListAllCourses({});
    }
  
    @Get('moodle/courses/:id/contents')
    async getMoodleCourseContents(@Param('id') id: number) {
      return await this.moodleInfoService.GetCourseContents({ courseid: id });
    }
  
    @Get('parentalapprovalmanagement')
    async getSiteInfoTestParentalApproval() {
      return await this.parentalApprovalService.GetSiteInfo({});
    }
  */
}
