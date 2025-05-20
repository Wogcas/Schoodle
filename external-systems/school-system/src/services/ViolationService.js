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
const ViolationRepository_1 = __importDefault(require("../repositories/ViolationRepository"));
const violationRepository = new ViolationRepository_1.default();
class ViolationService {
    reportLateSubmission(teacherEmail, courseIdNumber, studentEmails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validación básica
                if (!teacherEmail || !courseIdNumber || !(studentEmails === null || studentEmails === void 0 ? void 0 : studentEmails.length)) {
                    throw new Error('Datos incompletos');
                }
                return yield violationRepository.createSubmissionViolations(teacherEmail, courseIdNumber, studentEmails);
            }
            catch (error) {
                throw new Error(`Error al registrar violaciones: ${error.message}`);
            }
        });
    }
}
exports.default = ViolationService;
