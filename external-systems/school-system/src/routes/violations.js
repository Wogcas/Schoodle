const express = require('express');
const router = express.Router();
const ViolationController = require('../controllers/ViolationController');

router.post('/', ViolationController.reportViolation);

module.exports = router;