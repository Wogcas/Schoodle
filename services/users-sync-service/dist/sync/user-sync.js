"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSyncService = void 0;
const auth_service_1 = require("../services/auth.service");
const config_1 = __importStar(require("../config"));
const school_service_1 = require("../services/school.service");
const generatePassword = (lastName) => {
    const prefix = lastName.substring(0, 3);
    return `Pass${prefix}`;
};
const syncUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!config_1.default.JWT_SECRET) {
            throw new Error('Falta JWT_SECRET en la configuración');
        }
        let sinceDate = (0, config_1.getLastSyncDate)();
        if (!sinceDate) {
            const oldestUser = yield (0, school_service_1.getOldestRegisteredUser)();
            sinceDate = new Date(oldestUser.registeredAt);
        }
        const users = yield (0, school_service_1.getUsersRegisteredSince)(sinceDate);
        const now = new Date();
        let authServiceAvailable = true;
        let allUsersSynced = true;
        if (users.length > 0) {
            for (const user of users) {
                try {
                    const authUser = {
                        idNumber: user.idNumber,
                        firstName: user.name, // Cambiado de name a firstName
                        lastName: user.lastName,
                        email: user.email,
                        password: generatePassword(user.lastName),
                        role: user.role || 'teacher' // Valor por defecto en minúscula
                    };
                    yield (0, auth_service_1.registerAuthUser)(authUser);
                    console.log(`User ${user.email} synchronized successfully`);
                }
                catch (error) {
                    allUsersSynced = false; // Marcamos que hubo un error
                    if ((error === null || error === void 0 ? void 0 : error.message) === 'AUTH_SERVICE_CONNECTION_ERROR') {
                        authServiceAvailable = false;
                        console.error('Error de conexión con el servicio de autenticación');
                    }
                    else {
                        console.error(`Error syncing user ${user.email}:`, error === null || error === void 0 ? void 0 : error.message);
                    }
                }
            }
        }
        // Actualizar solo si no hubo errores
        if (authServiceAvailable && allUsersSynced) {
            (0, config_1.updateLastSyncDate)(now);
            console.log(`Sync completed at ${now.toISOString()}`);
        }
        else {
            console.log('No se actualiza la fecha por errores durante la sincronización');
        }
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.message) === 'SCHOOL_SYSTEM_CONNECTION_ERROR') {
            console.error('Error de conexión con el school-system, sincronización abortada');
        }
        else {
            console.error('Sync error:', error === null || error === void 0 ? void 0 : error.message);
        }
    }
});
const startSyncService = () => {
    syncUsers(); // Ejecutar inmediatamente al iniciar
    const cron = require('node-cron');
    cron.schedule(config_1.default.SYNC_INTERVAL, syncUsers);
};
exports.startSyncService = startSyncService;
