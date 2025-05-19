import { Injectable } from "@nestjs/common";
import { timestamp } from "rxjs";
import { CourseContentDTO } from "src/dtos/course-content.dto";
import { CourseDTO } from "src/dtos/course.dto";
import { CourseAssignment } from "src/grpc/course-assignments.interface";
import { GrpcCourseModule, GrpcCourseSection, GrpcModuleDate } from "src/grpc/course-content.interface";
import { GrpcCourse } from "src/grpc/course.interface";
import { EnrolledUser } from "src/grpc/enrolled-users.interface";
import { UserCourse } from "src/grpc/user-courses.interface";
import { UserGradesResponse } from "src/grpc/user-grades.interface";

@Injectable()
export class MapperService {

    mapCourses(response: any): GrpcCourse[] {
        return response.map(course => ({
            id: course.id,
            fullname: course.fullname,
            displayname: course.displayname,
            idnumber: course.idnumber,
            format: course.format,
            timecreated: this.convertDateToTimestamp(course.timecreated),
            timemodified: this.convertDateToTimestamp(course.timemodified)
        }));
    }

    mapCourseContents(response: any): GrpcCourseSection[] {
        return response.map(section => ({
            id: section.id,
            name: section.name,
            section: section.section,
            modules: this.mapModules(section.modules)
        }));
    }

    private mapModules(modules: any[]): GrpcCourseModule[] {
        return modules.map(module => ({
            id: module.id,
            name: module.name,
            dates: this.mapDates(module.dates)
        }));
    }

    private mapDates(dates: any[]): GrpcModuleDate[] {
        return dates.map(date => ({
            label: date.label,
            timestamp: typeof date.timestamp === "string"
                ? this.convertDateToTimestamp(date.timestamp)
                : date.timestamp
        }));
    }

    mapUserCourses(response: any[]): UserCourse[] {
        return response.map(course => ({
            id: course.id,
            fullname: course.fullname,
            displayname: course.displayname,
            idnumber: course.idnumber || '', // Manejo de valores nulos
            format: course.format,
            timemodified: this.convertDateToTimestamp(course.timemodified)
        }));
    }

    mapEnrolledUsers(response: any[]): EnrolledUser[] {
        return response.map(user => ({
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            fullname: user.fullname,
            email: user.email,
            enrolledcourses: this.mapEnrolledCourses(user.enrolledcourses || []),
            roles: this.mapRoles(user.roles || [])
        }));
    }

    private mapEnrolledCourses(courses: any[]): { id: number, fullname: string, shortname: string }[] {
        return courses.map(course => ({
            id: course.id,
            fullname: course.fullname,
            shortname: course.shortname
        }));
    }

    private mapRoles(roles: any[]): { roleid: number, shortname: string }[] {
        return roles.map(role => ({
            roleid: role.roleid,
            shortname: role.shortname
        }));
    }

    mapCourseAssignments(response: any[]): CourseAssignment[] {
        return response.map(assignment => this.mapSingleAssignment(assignment));
    }

    private mapSingleAssignment(assignment: any): CourseAssignment {
        return {
            id: assignment.id,
            cmid: assignment.cmid,
            course: assignment.course,
            name: assignment.name,
            sendnotifications: Boolean(assignment.sendnotifications),
            duedate: this.convertDateToTimestamp(assignment.duedate),
            grade: assignment.grade,
            intro: assignment.intro
        };
    }

    mapUserGradesResponse(data: any): UserGradesResponse {
        return {
            courseid: Number(data.courseid),
            userid: Number(data.userid),
            userfullname: String(data.userfullname),
            gradeItems: this.mapGradeItems(data.gradeItems)
        };
    }

    private mapGradeItems(items: any[]): { itemname: string, grade: string }[] {
        return items.map(item => ({
            itemname: String(item.itemname),
            grade: String(item.grade)
        }));
    }

    private convertDateToTimestamp(dateStr: string): number {
        const [datePart, timePart] = dateStr.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        return Math.floor(Date.UTC(year, month - 1, day, hours, minutes, seconds) / 1000);
    }
}