"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CourseController_1 = __importDefault(require("../controllers/CourseController"));
const router = express_1.default.Router();
router.get('/by-term/:termId', CourseController_1.default.getCoursesByTerm);
exports.default = router;
