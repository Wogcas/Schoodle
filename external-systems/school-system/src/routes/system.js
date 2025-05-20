"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const SystemController_1 = __importDefault(require("../controllers/SystemController"));
router.get('/info', SystemController_1.default.getInfo);
exports.default = router;
