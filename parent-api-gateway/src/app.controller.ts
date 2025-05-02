import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientGrpc } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
  private moodleInfoService;
  constructor(private readonly appService: AppService,
    @Inject('STUDENT_PROGRESS_SERVICE') private client: ClientGrpc
  ) {}
  onModuleInit(){
    this.moodleInfoService = this.client.getService('MoodleInfoService');
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('moodle')
  async getMoodleInfo() {
    return await this.moodleInfoService.GetSiteInfo({});
  }
}
