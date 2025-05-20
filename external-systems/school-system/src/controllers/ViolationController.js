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
const ViolationService_1 = __importDefault(require("../services/ViolationService"));
const violationService = new ViolationService_1.default();
class ViolationController {
    static reportLateSubmission(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { teacherEmail, courseIdNumber, students } = req.body;
                const studentEmails = students.map(s => s.studentEmail);
                const result = yield violationService.reportLateSubmission(teacherEmail, courseIdNumber, studentEmails);
                res.json({
                    success: true,
                    violationId: result.violationId,
                    affectedStudents: result.totalStudentsAffected,
                    message: `Reporte registrado con ${result.totalStudentsAffected} violaciones`
                });
            }
            catch (error) {
                const err = error;
                res.status(err.message.includes('no encontrado') ? 404 : 500).json({
                    error: 'Error en el reporte',
                    details: err.message
                });
            }
        });
    }
}
exports.default = ViolationController;
