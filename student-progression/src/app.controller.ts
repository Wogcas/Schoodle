import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import { SiteInfoDTO } from './dtos/site-info.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @GrpcMethod('MoodleInfoService', 'GetSiteInfo')
  async getMoodleInfo(): Promise<SiteInfoDTO> {
    try {
      return await this.appService.fetchMoodleSiteInfo();
    } catch (error) {
      console.error('Error fetching Moodle site info:', error);
      throw new Error('Failed to fetch Moodle site info');
    }
  }
  
}
