const express = require('express');
const router = express.Router();
const GradeController = require('../controllers/GradeController');

router.post('/sync', GradeController.syncGrades);

module.exports = router;