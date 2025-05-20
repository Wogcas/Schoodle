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
const TeacherRepository_1 = __importDefault(require("../repositories/TeacherRepository"));
class TeacherService {
    constructor() {
        this.teacherRepository = new TeacherRepository_1.default();
    }
    getCoursesWithStudents(teacherIdNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.teacherRepository.getTeacherCoursesWithStudents(teacherIdNumber);
            }
            catch (error) {
                console.error('Error fetching courses with students:', error);
                throw new Error('Could not fetch courses. Please try again later.');
            }
        });
    }
}
exports.default = TeacherService;
