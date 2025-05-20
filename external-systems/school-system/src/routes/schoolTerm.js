"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SchoolTermController_1 = __importDefault(require("../controllers/SchoolTermController"));
const router = express_1.default.Router();
router.get('/latest', SchoolTermController_1.default.getLatestTerm);
exports.default = router;
