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
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const userRepository = new UserRepository_1.default();
class UserService {
    getFirstRegisteredUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userRepository.getFirstRegisteredUser();
                return user || null;
            }
            catch (error) {
                throw new Error(`Error fetching first user: ${error.message}`);
            }
        });
    }
    getUsersRegisteredSince(startDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userRepository.getUsersRegisteredSince(startDate);
                return users.filter(user => user.role !== null);
            }
            catch (error) {
                throw new Error(`Error fetching users with role: ${error.message}`);
            }
        });
    }
}
exports.default = UserService;
