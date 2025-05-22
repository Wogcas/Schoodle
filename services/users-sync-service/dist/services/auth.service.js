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
exports.registerAuthUser = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const registerAuthUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(`${config_1.default.AUTH_SERVICE_URL}/auth/sync/user`, user, {
            headers: {
                'x-api-key': config_1.default.JWT_SECRET,
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 201 && response.status !== 200) {
            throw new Error(`Error en registro: ${response.statusText}`);
        }
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 'ECONNREFUSED' || (error === null || error === void 0 ? void 0 : error.code) === 'ENOTFOUND') {
            throw new Error('AUTH_SERVICE_CONNECTION_ERROR');
        }
        throw error;
    }
});
exports.registerAuthUser = registerAuthUser;
