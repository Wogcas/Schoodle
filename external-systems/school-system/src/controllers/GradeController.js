const GradeService = require('../services/GradeService');

class GradeController {
    async syncGrades(req, res) {
        try {
            const { courseTakenId, units } = req.body;
            const result = await GradeService.syncGrades(courseTakenId, units);
            res.status(200).json({
                message: 'Grades synchronized successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error synchronizing grades',
                error: error.message
            });
        }
    }
}

module.exports = new GradeController();