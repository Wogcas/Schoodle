import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcMoodleInterface } from 'src/grpc/grpc-moodle.interface';

@Injectable()
export class MoodleInfoService implements OnModuleInit {
    private grpcMoodle;

    constructor(
        @Inject('STUDENT_PROGRESS_SERVICE') private client: ClientGrpc,
    ) { }

    onModuleInit() {
        this.grpcMoodle = this.client.getService<GrpcMoodleInterface>('MoodleInfoService');
    }

    getHello(): string {
        return 'Hello World!';
    }

    listAllCourses() {
        return this.grpcMoodle.ListAllCourses({});
    }

    getCourseContents(courseid: number) {
        return this.grpcMoodle.GetCourseContents({courseid});
    }

    getStudentCourses(userid: number) {
        return this.grpcMoodle.GetUserCourses({userid});
    }

    getCourseStudents(courseid: number) {
        return this.grpcMoodle.GetEnrolledUsers({courseid});
    }

    getCourseAssignments(courseid: number) {
        return this.grpcMoodle.GetCourseAssignments({courseid});
    }

    getAssignmentsInBetween(courseid: number, startdate: string, enddate: string) {
        return this.grpcMoodle.GetAssignmentsBetweenDates({courseid, startdate, enddate});
    }

    getUserGradesByType(userid: number, courseid: number, gradeitem: string) {
        return this.grpcMoodle.GetUserGradesByType({userid, courseid, gradeitem});
    }
    
}