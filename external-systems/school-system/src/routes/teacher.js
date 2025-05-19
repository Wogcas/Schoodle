"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TeacherController_1 = __importDefault(require("../controllers/TeacherController"));
const router = express_1.default.Router();
router.get('/:teacherIdNumber/courses-with-students', TeacherController_1.default.getCoursesWithStudents);
exports.default = router;
