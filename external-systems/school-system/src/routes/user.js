"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = express_1.default.Router();
router.get('/first-registered', UserController_1.default.getFirstRegisteredUser);
router.get('/registered-since', UserController_1.default.getUsersRegisteredSince);
exports.default = router;
