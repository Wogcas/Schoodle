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
const CourseService_1 = __importDefault(require("../services/CourseService"));
const SchoolTermService_1 = __importDefault(require("../services/SchoolTermService"));
const courseService = new CourseService_1.default();
const termService = new SchoolTermService_1.default();
class CourseController {
    static getCoursesByTerm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const termId = Number(req.params.termId);
                // Verificar que el período existe
                const term = yield termService.getTermById(termId);
                if (!term) {
                    res.status(404).json({ error: 'Período escolar no encontrado' });
                    return;
                }
                const courses = yield courseService.getCoursesByTermId(termId);
                if (courses.length === 0) {
                    res.status(404).json({
                        message: 'No se encontraron cursos para este período escolar',
                        termId
                    });
                    return;
                }
                // Respuesta simplificada
                res.json(courses.map(course => ({
                    idNumber: course.idNumber,
                    name: course.name
                })));
            }
            catch (error) {
                res.status(500).json({
                    error: 'Error al obtener los cursos',
                    details: error.message
                });
            }
        });
    }
}
exports.default = CourseController;
