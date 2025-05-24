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
exports.getUsersRegisteredSince = exports.getOldestRegisteredUser = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const https_1 = __importDefault(require("https"));
// 1. Crear agente HTTPS que ignora certificados autofirmados (SOLO DESARROLLO)
const insecureAgent = new https_1.default.Agent({
    rejectUnauthorized: false
});
// 2. Configurar cliente API
const apiClient = axios_1.default.create({
    baseURL: config_1.default.AUTH_SERVICE_URL,
    // @ts-ignore // Ignoramos el error de tipo intencionalmente
    httpsAgent: insecureAgent,
    headers: {
        'Content-Type': 'application/json'
    }
});
const getOldestRegisteredUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield apiClient.get(`${config_1.default.SCHOOL_SYSTEM_URL}/api/school-system/users/first-registered`);
        return response.data;
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 'ECONNREFUSED' || (error === null || error === void 0 ? void 0 : error.code) === 'ENOTFOUND') {
            throw new Error('SCHOOL_SYSTEM_CONNECTION_ERROR');
        }
        throw error;
    }
});
exports.getOldestRegisteredUser = getOldestRegisteredUser;
const getUsersRegisteredSince = (since) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield apiClient.get(`${config_1.default.SCHOOL_SYSTEM_URL}/api/school-system/users/registered-since`, {
            params: { since: since.toISOString() }
        });
        return response.data;
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 'ECONNREFUSED' || (error === null || error === void 0 ? void 0 : error.code) === 'ENOTFOUND') {
            throw new Error('SCHOOL_SYSTEM_CONNECTION_ERROR');
        }
        throw error;
    }
});
exports.getUsersRegisteredSince = getUsersRegisteredSince;
