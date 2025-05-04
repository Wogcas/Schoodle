const express = require('express');
const router = express.Router();
const SystemController = require('../controllers/SystemController');

router.get('/info', SystemController.getInfo);

module.exports = router;