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
const StudentService_1 = __importDefault(require("../services/StudentService"));
const studentService = new StudentService_1.default();
class StudentController {
    static getStudentsByTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tutorIdNumber } = req.params;
            if (!tutorIdNumber) {
                res.status(400).json({ error: 'Tutor ID number is required' });
                return;
            }
            try {
                const students = yield studentService.getStudentsByTutorIdNumber(tutorIdNumber);
                res.json(students);
            }
            catch (error) {
                res.status(500).json({
                    error: 'Error retrieving students',
                    details: error.message
                });
            }
        });
    }
    ;
    static getCurrentCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { studentIdNumber } = req.params;
            try {
                if (!studentIdNumber) {
                    res.status(400).json({ error: 'Student ID number is required' });
                    return;
                }
                const result = yield studentService.getCurrentCourses(studentIdNumber);
                res.json({
                    courses: result.courses,
                    student: result.student
                });
            }
            catch (error) {
                const message = error.message;
                if (message.includes('not found')) {
                    res.status(404).json({ error: message });
                }
                else {
                    res.status(500).json({
                        error: 'Error retrieving courses',
                        details: message
                    });
                }
            }
        });
    }
    ;
}
exports.default = StudentController;
