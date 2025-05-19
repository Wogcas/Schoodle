import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class MoodleInfoService implements OnModuleInit {
    private moodleInfoService;

    constructor(
        @Inject('STUDENT_PROGRESS_SERVICE') private client: ClientGrpc,
    ) { }

    onModuleInit() {
        this.moodleInfoService = this.client.getService('MoodleInfoService');
    }

    getHello(): string {
        return 'Hello World!';
    }

    getSiteInfo() {
        return this.moodleInfoService.GetSiteInfo();
    }

    listAllCourses() {
        return this.moodleInfoService.ListAllCourses();
    }

    getCourseContents(courseid: number) {
        return this.moodleInfoService.GetCourseContents(courseid);
    }

    
}