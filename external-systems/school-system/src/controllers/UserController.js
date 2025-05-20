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
const UserService_1 = __importDefault(require("../services/UserService"));
const userService = new UserService_1.default();
class UserController {
    static getFirstRegisteredUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userService.getFirstRegisteredUser();
                if (!user) {
                    res.status(404).json({ message: 'No users found' });
                    return;
                }
                res.json({
                    id: user.id,
                    idNumber: user.idNumber,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    registeredAt: user.registeredAt
                });
            }
            catch (error) {
                res.status(500).json({
                    error: 'Error retrieving first user',
                    details: error.message
                });
            }
        });
    }
    ;
    static getUsersRegisteredSince(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startDate = new Date(req.query.since);
                if (isNaN(startDate.getTime())) {
                    res.status(400).json({ error: 'Invalid start date format' });
                    return;
                }
                const users = yield userService.getUsersRegisteredSince(startDate);
                if (users.length === 0) {
                    res.status(404).json({
                        message: 'No users found with Tutor or Teacher role after specified date',
                        startDate: startDate.toISOString()
                    });
                    return;
                }
                res.json(users.map(user => (Object.assign(Object.assign({}, user), { registeredAt: user.registeredAt.toISOString() }))));
            }
            catch (error) {
                res.status(500).json({
                    error: 'Error retrieving users',
                    details: error.message
                });
            }
        });
    }
}
exports.default = UserController;
