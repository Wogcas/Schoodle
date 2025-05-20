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
const TeacherService_1 = __importDefault(require("../services/TeacherService"));
const teacherService = new TeacherService_1.default();
class TeacherController {
    static getCoursesWithStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { teacherIdNumber } = req.params;
            try {
                if (!teacherIdNumber) {
                    res.status(400).json({ error: 'Teacher ID number is required' });
                    return;
                }
                const result = yield teacherService.getCoursesWithStudents(teacherIdNumber);
                if (result.courses.length === 0) {
                    res.status(404).json({
                        message: 'No current courses found for this teacher',
                        teacher: result.teacher
                    });
                    return;
                }
                res.json(result);
            }
            catch (error) {
                const message = error.message;
                if (message.includes('not found')) {
                    res.status(404).json({ error: message });
                }
                else {
                    res.status(500).json({
                        error: 'Error retrieving teacher courses',
                        details: message
                    });
                }
            }
        });
    }
}
exports.default = TeacherController;
