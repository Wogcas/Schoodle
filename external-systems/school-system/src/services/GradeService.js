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
const GradeRepository_1 = __importDefault(require("../repositories/GradeRepository"));
const gradeRepository = new GradeRepository_1.default();
class GradeService {
    submitGrade(studentEmail, courseIdNumber, grade) {
        return __awaiter(this, void 0, void 0, function* () {
            if (grade < 0 || grade > 100) {
                throw new Error('La calificación debe estar entre 0 y 100');
            }
            try {
                yield gradeRepository.submitGradeTransaction(studentEmail, courseIdNumber, grade);
                return { success: true };
            }
            catch (error) {
                throw new Error(`Error al registrar calificación: ${error.message}`);
            }
        });
    }
}
exports.default = GradeService;
