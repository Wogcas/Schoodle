"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const StudentController_1 = __importDefault(require("../controllers/StudentController"));
const router = express_1.default.Router();
router.get('/by-tutor/:tutorIdNumber', StudentController_1.default.getStudentsByTutor);
router.get('/:studentIdNumber/current-courses', StudentController_1.default.getCurrentCourses);
exports.default = router;
