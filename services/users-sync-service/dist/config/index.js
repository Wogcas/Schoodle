"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLastSyncDate = exports.getLastSyncDate = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const config = {
    SYNC_INTERVAL: process.env.SYNC_INTERVAL || '*/10 * * * *',
    SCHOOL_SYSTEM_URL: process.env.SCHOOL_SYSTEM_URL || 'http://localhost:3004',
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://localhost:3005',
    STATE_FILE_PATH: process.env.STATE_FILE_PATH || './sync-state.json',
    JWT_SECRET: process.env.JWT_SECRET || ''
};
const getStateFilePath = () => path_1.default.resolve(process.cwd(), config.STATE_FILE_PATH);
const getLastSyncDate = () => {
    try {
        const stateFile = fs_1.default.readFileSync(getStateFilePath(), 'utf-8');
        const state = JSON.parse(stateFile);
        return state.lastSyncDate ? new Date(state.lastSyncDate) : undefined;
    }
    catch (error) {
        return undefined;
    }
};
exports.getLastSyncDate = getLastSyncDate;
const updateLastSyncDate = (date) => {
    const state = {
        lastSyncDate: date.toISOString()
    };
    fs_1.default.writeFileSync(getStateFilePath(), JSON.stringify(state, null, 2), 'utf-8');
};
exports.updateLastSyncDate = updateLastSyncDate;
exports.default = config;
