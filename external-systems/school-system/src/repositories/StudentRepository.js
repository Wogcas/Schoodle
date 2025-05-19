"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("../database/knex"));
const BaseRepository_1 = __importDefault(require("./BaseRepository"));
class StudentRepository extends BaseRepository_1.default {
    constructor() {
        super('Students');
    }
    getStudentsByTutorIdNumber(tutorIdNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)('Users as UT')
                .select({
                id: 'US.id',
                idNumber: 'US.idNumber',
                name: 'US.name',
                lastName: 'US.lastName',
                email: 'US.email',
                registeredAt: 'US.registeredAt' // Campo añadido
            })
                .innerJoin('Tutors as T', 'UT.id', 'T.userId')
                .innerJoin('TutorsStudents as TS', 'T.userId', 'TS.tutorId')
                .innerJoin('Students as S', 'TS.studentId', 'S.userId')
                .innerJoin('Users as US', 'S.userId', 'US.id')
                .where('UT.idNumber', tutorIdNumber);
        });
    }
    ;
    getStudentCurrentCourses(idNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield (0, knex_1.default)('Users as U')
                .select({
                idNumber: 'U.idNumber',
                name: 'U.name',
                lastName: 'U.lastName'
            })
                .innerJoin('Students as S', 'U.id', 'S.userId')
                .where('U.idNumber', idNumber)
                .first();
            if (!student) {
                throw new Error('Student not found');
            }
            const courses = yield (0, knex_1.default)('Users as U')
                .select({
                courseIdNumber: 'C.idnumber',
                courseName: 'C.name',
                teacherIdNumber: 'UT.idNumber',
                teacherName: knex_1.default.raw('CONCAT("Prof. ", UT.name, " ", UT.lastName)'),
            })
                .innerJoin('Students as S', 'U.id', 'S.userId')
                .innerJoin('EnrolledTerms as ET', 'S.userId', 'ET.studentId')
                .innerJoin('SchoolTerms as ST', 'ET.schoolTermId', 'ST.id')
                .innerJoin('CourseTaken as CT', 'ET.id', 'CT.enrolledTermId')
                .innerJoin('Course as C', 'CT.courseId', 'C.id')
                .innerJoin('Teachers as T', 'C.teacherId', 'T.userId')
                .innerJoin('Users as UT', 'T.userId', 'UT.id')
                .where('U.idNumber', idNumber)
                .andWhere('ST.termStartDate', '<=', knex_1.default.fn.now())
                .andWhere('ST.termEndDate', '>=', knex_1.default.fn.now())
                .groupBy(['C.id', 'UT.id']);
            return {
                courses: courses.map(course => ({
                    idNumber: course.courseIdNumber,
                    name: course.courseName,
                    teacher: {
                        idNumber: course.teacherIdNumber,
                        name: course.teacherName
                    }
                })),
                student: {
                    idNumber: student.idNumber,
                    name: `${student.name} ${student.lastName}`
                }
            };
        });
    }
}
exports.default = StudentRepository;
