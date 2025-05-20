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
const SchoolTermService_1 = __importDefault(require("../services/SchoolTermService"));
const termService = new SchoolTermService_1.default();
class SchoolTermController {
    static getLatestTerm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const term = yield termService.getLatestTerm();
                if (!term) {
                    res.status(404).json({
                        message: 'No se encontraron períodos escolares registrados'
                    });
                    return;
                }
                res.json({
                    id: term.id,
                    termStartDate: term.termStartDate.toISOString().split('T')[0],
                    termEndDate: term.termEndDate.toISOString().split('T')[0]
                });
            }
            catch (error) {
                res.status(500).json({
                    error: 'Error al obtener el período escolar',
                    details: error.message
                });
            }
        });
    }
}
exports.default = SchoolTermController;
