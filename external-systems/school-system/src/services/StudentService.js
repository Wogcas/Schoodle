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
const StudentRepository_1 = __importDefault(require("../repositories/StudentRepository"));
class StudentService {
    constructor() {
        this.studentRepository = new StudentRepository_1.default();
    }
    getStudentsByTutorIdNumber(tutorIdNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.studentRepository.getStudentsByTutorIdNumber(tutorIdNumber);
            }
            catch (error) {
                console.error('Error fetching students by tutor ID number:', error);
                throw new Error('Could not fetch students. Please try again later.');
            }
        });
    }
    getCurrentCourses(studentIdNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.studentRepository.getStudentCurrentCourses(studentIdNumber);
            }
            catch (error) {
                throw new Error(`Error fetching courses: ${error.message}`);
            }
        });
    }
}
exports.default = StudentService;
