"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GradeController_1 = __importDefault(require("../controllers/GradeController"));
const router = express_1.default.Router();
router.post('/submit', GradeController_1.default.submitGrade);
exports.default = router;
