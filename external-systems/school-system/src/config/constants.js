"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_HOST = exports.SERVER_PORT = void 0;
exports.SERVER_PORT = parseInt(process.env.SERVER_PORT || '3004', 10);
exports.SERVER_HOST = process.env.SERVER_HOST || 'localhost';
