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
const GradeService_1 = __importDefault(require("../services/GradeService"));
const gradeService = new GradeService_1.default();
class GradeController {
    static submitGrade(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseIdNumber, studentEmail, grade } = req.body;
                if (!courseIdNumber || !studentEmail || grade === undefined) {
                    res.status(400).json({ error: 'Datos incompletos' });
                    return;
                }
                yield gradeService.submitGrade(studentEmail, courseIdNumber, grade);
                res.json({
                    success: true,
                    message: 'Calificación registrada exitosamente'
                });
            }
            catch (error) {
                const err = error;
                if (err.message.includes('no encontrado')) {
                    res.status(404).json({ error: err.message });
                }
                else {
                    res.status(500).json({
                        error: 'Error al procesar la calificación',
                        details: err.message
                    });
                }
            }
        });
    }
}
exports.default = GradeController;
