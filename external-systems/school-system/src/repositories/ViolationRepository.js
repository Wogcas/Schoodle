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
class ViolationRepository {
    constructor() {
    }
    createSubmissionViolations(teacherEmail, courseIdNumber, studentEmails) {
        return __awaiter(this, void 0, void 0, function* () {
            return knex_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                // 1. Obtener IDs del maestro y curso
                const teacher = yield trx('Users')
                    .select('T.userId')
                    .innerJoin('Teachers as T', 'Users.id', 'T.userId')
                    .where('Users.email', teacherEmail)
                    .first();
                if (!teacher)
                    throw new Error('Maestro no encontrado');
                const course = yield trx('Course')
                    .select('id')
                    .where('idnumber', courseIdNumber)
                    .first();
                if (!course)
                    throw new Error('Curso no encontrado');
                // 2. Crear GradeSubmissionViolation
                // 2. Crear GradeSubmissionViolation
                const [violationId] = yield trx('GradeSubmissionViolations')
                    .insert({
                    teacherId: teacher.userId,
                    violationDate: knex_1.default.fn.now()
                });
                // 3. Procesar estudiantes
                const violations = [];
                for (const studentEmail of studentEmails) {
                    const student = yield trx('Users')
                        .select('S.userId')
                        .innerJoin('Students as S', 'Users.id', 'S.userId')
                        .where('Users.email', studentEmail)
                        .first();
                    if (!student)
                        continue; // Saltar estudiantes no encontrados
                    // Obtener CourseTaken correspondiente
                    const courseTaken = yield trx('CourseTaken as CT')
                        .select('CT.id')
                        .innerJoin('EnrolledTerms as ET', 'CT.enrolledTermId', 'ET.id')
                        .where('ET.studentId', student.userId)
                        .andWhere('CT.courseId', course.id)
                        .first();
                    if (courseTaken) {
                        violations.push({
                            gradeSubmissionViolationId: violationId,
                            courseTakenId: courseTaken.id
                        });
                    }
                }
                // 4. Insertar SubmissionViolations
                if (violations.length > 0) {
                    yield trx('SubmissionViolations').insert(violations);
                }
                return {
                    violationId,
                    totalStudentsAffected: violations.length
                };
            }));
        });
    }
}
exports.default = ViolationRepository;
