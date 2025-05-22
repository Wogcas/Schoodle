"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSL_CERT_PATH = exports.SSL_KEY_PATH = exports.HTTPS_PORT = exports.HTTP_PORT = exports.SERVER_HOST = exports.SERVER_PORT = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const rootDir = path_1.default.resolve(__dirname, '../../');
function resolveEnvPath(envVar, fallback) {
    if (!envVar)
        return path_1.default.join(rootDir, fallback);
    return path_1.default.isAbsolute(envVar) ? envVar : path_1.default.join(rootDir, envVar);
}
exports.SERVER_PORT = parseInt(process.env.SERVER_PORT || '3004', 10);
exports.SERVER_HOST = process.env.SERVER_HOST || '0.0.0.0';
exports.HTTP_PORT = parseInt(process.env.HTTP_PORT || '80', 10);
exports.HTTPS_PORT = parseInt(process.env.HTTPS_PORT || '443', 10);
exports.SSL_KEY_PATH = resolveEnvPath(process.env.SSL_KEY_PATH, 'ssl/server.key');
exports.SSL_CERT_PATH = resolveEnvPath(process.env.SSL_CERT_PATH, 'ssl/server.crt');
