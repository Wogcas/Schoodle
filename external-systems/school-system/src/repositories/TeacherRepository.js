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
class TeacherRepository extends BaseRepository_1.default {
    constructor() {
        super('Teachers');
    }
    getTeacherCoursesWithStudents(teacherIdNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            // Primero obtenemos la información del maestro
            const teacher = yield (0, knex_1.default)('Users as U')
                .select({
                id: 'U.id',
                idNumber: 'U.idNumber',
                name: 'U.name',
                lastName: 'U.lastName'
            })
                .innerJoin('Teachers as T', 'U.id', 'T.userId')
                .where('U.idNumber', teacherIdNumber)
                .first();
            if (!teacher) {
                throw new Error('Teacher not found');
            }
            // Consulta principal corregida
            const coursesData = yield (0, knex_1.default)('Course as C')
                .select([
                'C.id as courseId',
                'C.idnumber as courseIdNumber',
                'C.name as courseName',
                'S.userId as studentId',
                'US.idNumber as studentIdNumber',
                'US.name as studentName',
                'US.lastName as studentLastName',
                'TUT.userId as tutorId',
                'UT.idNumber as tutorIdNumber',
                'UT.name as tutorName',
                'UT.lastName as tutorLastName'
            ])
                .innerJoin('Teachers as T', 'C.teacherId', 'T.userId')
                .innerJoin('Users as UTeach', 'T.userId', 'UTeach.id') // ¡Nuevo join añadido!
                .innerJoin('CourseTaken as CT', 'C.id', 'CT.courseId')
                .innerJoin('EnrolledTerms as ET', 'CT.enrolledTermId', 'ET.id')
                .innerJoin('SchoolTerms as ST', 'ET.schoolTermId', 'ST.id')
                .innerJoin('Students as S', 'ET.studentId', 'S.userId')
                .innerJoin('Users as US', 'S.userId', 'US.id')
                .leftJoin('TutorsStudents as TS', 'S.userId', 'TS.studentId')
                .leftJoin('Tutors as TUT', 'TS.tutorId', 'TUT.userId')
                .leftJoin('Users as UT', 'TUT.userId', 'UT.id')
                .where('UTeach.idNumber', teacherIdNumber) // Usamos la nueva referencia
                .andWhere('ST.termStartDate', '<=', knex_1.default.fn.now())
                .andWhere('ST.termEndDate', '>=', knex_1.default.fn.now())
                .orderBy(['C.id', 'S.userId', 'TUT.userId']);
            // Procesamos los datos para la estructura deseada
            const coursesMap = new Map();
            coursesData.forEach(row => {
                if (!coursesMap.has(row.courseId)) {
                    coursesMap.set(row.courseId, {
                        idNumber: row.courseIdNumber,
                        name: row.courseName,
                        students: new Map()
                    });
                }
                const course = coursesMap.get(row.courseId);
                if (!course.students.has(row.studentId)) {
                    course.students.set(row.studentId, {
                        idNumber: row.studentIdNumber,
                        name: `${row.studentName} ${row.studentLastName}`,
                        tutors: []
                    });
                }
                const student = course.students.get(row.studentId);
                if (row.tutorId) {
                    student.tutors.push({
                        idNumber: row.tutorIdNumber,
                        name: `${row.tutorName} ${row.tutorLastName}`
                    });
                }
            });
            // Convertimos los Maps a arrays
            const courses = Array.from(coursesMap.values()).map(course => ({
                idNumber: course.idNumber,
                name: course.name,
                students: Array.from(course.students.values())
            }));
            return {
                courses,
                teacher: {
                    idNumber: teacher.idNumber,
                    name: `Prof. ${teacher.name} ${teacher.lastName}`
                }
            };
        });
    }
}
exports.default = TeacherRepository;
