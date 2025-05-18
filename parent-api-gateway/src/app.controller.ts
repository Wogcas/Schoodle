import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientGrpc } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
  private moodleInfoService;
  private parentalApprovalService;
  constructor(private readonly appService: AppService,
    @Inject('STUDENT_PROGRESS_SERVICE') private client: ClientGrpc,
    @Inject('PARENTAL_APPROVAL_SERVICE') private client2: ClientGrpc,
  ) {}
  onModuleInit(){
    this.moodleInfoService = this.client.getService('MoodleInfoService');
    this.parentalApprovalService = this.client2.getService('ParentalApprovalManagementGrpcService');
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('moodle')
  async getMoodleInfo() {
    return await this.moodleInfoService.GetSiteInfo({});
  }
  
  @Get('parentalapprovalmanagement')
  async getSiteInfoTestParentalApproval() {
    return await this.parentalApprovalService.GetSiteInfo({});
  }
}
