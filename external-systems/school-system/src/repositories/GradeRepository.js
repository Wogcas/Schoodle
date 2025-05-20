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
class GradeRepository {
    constructor() {
    }
    submitGradeTransaction(studentEmail, courseIdNumber, grade) {
        return __awaiter(this, void 0, void 0, function* () {
            return knex_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                // 1. Obtener IDs necesarios
                const student = yield trx('Users')
                    .select('S.userId as studentId')
                    .innerJoin('Students as S', 'Users.id', 'S.userId')
                    .where('Users.email', studentEmail)
                    .first();
                if (!student)
                    throw new Error('Estudiante no encontrado');
                const course = yield trx('Course')
                    .select('id')
                    .where('idnumber', courseIdNumber)
                    .first();
                if (!course)
                    throw new Error('Curso no encontrado');
                // 2. Actualizar calificación en CourseTaken
                // 1. Obtén los IDs de CourseTaken a actualizar
                const courseTakenIds = yield trx('EnrolledTerms as ET')
                    .innerJoin('CourseTaken as CT', 'ET.id', 'CT.enrolledTermId')
                    .innerJoin('Course as C', 'CT.courseId', 'C.id')
                    .where('ET.studentId', student.studentId)
                    .andWhere('C.idnumber', courseIdNumber)
                    .select('CT.id');
                // 2. Haz el update solo si hay resultados
                const ids = courseTakenIds.map(row => row.id);
                let updated = 0;
                if (ids.length > 0) {
                    updated = yield trx('CourseTaken')
                        .whereIn('id', ids)
                        .update({ score: grade });
                }
                if (updated === 0)
                    throw new Error('Registro CourseTaken no encontrado');
                // 3. Verificar si todos los cursos del término tienen calificación
                const enrolledTerm = yield trx('EnrolledTerms as ET')
                    .select('ET.id', knex_1.default.raw('COUNT(CT.id) as total_courses'), knex_1.default.raw('SUM(CASE WHEN CT.score IS NOT NULL THEN 1 ELSE 0 END) as graded_courses'))
                    .innerJoin('CourseTaken as CT', 'ET.id', 'CT.enrolledTermId')
                    .where('ET.studentId', student.studentId)
                    .groupBy('ET.id')
                    .first();
                if (enrolledTerm && enrolledTerm.total_courses === enrolledTerm.graded_courses) {
                    // 4. Calcular promedio si todos están calificados
                    const average = yield trx('CourseTaken')
                        .avg('score as average')
                        .where('enrolledTermId', enrolledTerm.id)
                        .first();
                    if (average && average.average !== undefined) {
                        yield trx('EnrolledTerms')
                            .update({ gradeScore: average.average })
                            .where('id', enrolledTerm.id);
                    }
                }
                return true;
            }));
        });
    }
}
exports.default = GradeRepository;
