import knex from '../database/knex';
import BaseRepository from './BaseRepository';

export default class GradeRepository {
    constructor() {
    }

    async submitGradeTransaction(
        studentEmail: string,
        courseIdNumber: string,
        grade: number
    ) {
        return knex.transaction(async (trx) => {
            // 1. Obtener IDs necesarios
            const student = await trx('Users')
                .select('S.userId as studentId')
                .innerJoin('Students as S', 'Users.id', 'S.userId')
                .where('Users.email', studentEmail)
                .first();

            if (!student) throw new Error('Estudiante no encontrado');

            const course = await trx('Course')
                .select('id')
                .where('idnumber', courseIdNumber)
                .first();

            if (!course) throw new Error('Curso no encontrado');

            // 2. Actualizar calificación en CourseTaken
            // 1. Obtén los IDs de CourseTaken a actualizar
            const courseTakenIds = await trx('EnrolledTerms as ET')
                .innerJoin('CourseTaken as CT', 'ET.id', 'CT.enrolledTermId')
                .innerJoin('Course as C', 'CT.courseId', 'C.id')
                .where('ET.studentId', student.studentId)
                .andWhere('C.idnumber', courseIdNumber)
                .select('CT.id');

            // 2. Haz el update solo si hay resultados
            const ids = courseTakenIds.map(row => row.id);
            let updated = 0;
            if (ids.length > 0) {
                updated = await trx('CourseTaken')
                    .whereIn('id', ids)
                    .update({ score: grade });
            }

            if (updated === 0) throw new Error('Registro CourseTaken no encontrado');

            // 3. Verificar si todos los cursos del término tienen calificación
            const enrolledTerm = await trx('EnrolledTerms as ET')
                .select(
                    'ET.id',
                    knex.raw('COUNT(CT.id) as total_courses'),
                    knex.raw('SUM(CASE WHEN CT.score IS NOT NULL THEN 1 ELSE 0 END) as graded_courses')
                )
                .innerJoin('CourseTaken as CT', 'ET.id', 'CT.enrolledTermId')
                .where('ET.studentId', student.studentId)
                .groupBy('ET.id')
                .first();

            if (enrolledTerm && enrolledTerm.total_courses === enrolledTerm.graded_courses) {
                // 4. Calcular promedio si todos están calificados
                const average = await trx('CourseTaken')
                    .avg('score as average')
                    .where('enrolledTermId', enrolledTerm.id)
                    .first();

                if (average && average.average !== undefined) {
                    await trx('EnrolledTerms')
                        .update({ gradeScore: average.average })
                        .where('id', enrolledTerm.id);
                }
            }

            return true;
        });
    }
}