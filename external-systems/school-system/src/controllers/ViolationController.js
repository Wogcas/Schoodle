const ViolationService = require('../services/ViolationService');

class ViolationController {
    async reportViolation(req, res) {
        try {
            const { teacherId, courseTakenUnitIds } = req.body;
            const violation = await ViolationService.reportViolation(teacherId, courseTakenUnitIds);
            res.status(201).json({ 
                message: 'Violation reported successfully',
                violation
            });
        } catch (error) {
            console.error('Error reporting violation:', error);
            res.status(500).json({ 
                error: 'An unexpected error occurred while reporting the violation. Please try again later.' 
            });
        }
    }
}

module.exports = new ViolationController();