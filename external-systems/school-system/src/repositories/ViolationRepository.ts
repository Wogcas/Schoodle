import knex from '../database/knex'

export default class ViolationRepository {
    constructor() {

    }

    async createSubmissionViolations(
        teacherEmail: string,
        courseIdNumber: string,
        studentEmails: string[]
    ) {
        return knex.transaction(async (trx) => {
            // 1. Obtener IDs del maestro y curso
            const teacher = await trx('Users')
                .select('T.userId')
                .innerJoin('Teachers as T', 'Users.id', 'T.userId')
                .where('Users.email', teacherEmail)
                .first();

            if (!teacher) throw new Error('Maestro no encontrado');

            const course = await trx('Course')
                .select('id')
                .where('idnumber', courseIdNumber)
                .first();

            if (!course) throw new Error('Curso no encontrado');

            // 2. Crear GradeSubmissionViolation
            // 2. Crear GradeSubmissionViolation
            const [violationId] = await trx('GradeSubmissionViolations')
                .insert({
                    teacherId: teacher.userId,
                    violationDate: knex.fn.now()
                });

            // 3. Procesar estudiantes
            const violations = [];

            for (const studentEmail of studentEmails) {
                const student = await trx('Users')
                    .select('S.userId')
                    .innerJoin('Students as S', 'Users.id', 'S.userId')
                    .where('Users.email', studentEmail)
                    .first();

                if (!student) continue; // Saltar estudiantes no encontrados

                // Obtener CourseTaken correspondiente
                const courseTaken = await trx('CourseTaken as CT')
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
                await trx('SubmissionViolations').insert(violations);
            }

            return {
                violationId,
                totalStudentsAffected: violations.length
            };
        });
    }
}