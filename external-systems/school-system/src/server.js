"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("./config/constants");
const express_1 = __importDefault(require("express"));
// Configuración SSL
const sslOptions = {
    key: fs_1.default.readFileSync(constants_1.SSL_KEY_PATH),
    cert: fs_1.default.readFileSync(constants_1.SSL_CERT_PATH)
};
// Servidor HTTPS principal
const httpsServer = https_1.default.createServer(sslOptions, app_1.default);
httpsServer.listen(constants_1.HTTPS_PORT, constants_1.SERVER_HOST, () => {
    console.log(`🚀 Secure server running on https://${constants_1.SERVER_HOST}:${constants_1.HTTPS_PORT}`);
});
// Redirección HTTP (Opcional para producción)
if (process.env.NODE_ENV === 'production') {
    const httpApp = (0, express_1.default)();
    httpApp.all('*', (req, res) => {
        var _a;
        const host = ((_a = req.headers.host) === null || _a === void 0 ? void 0 : _a.includes('localhost'))
            ? `${constants_1.SERVER_HOST}:${constants_1.HTTPS_PORT}`
            : req.headers.host;
        res.redirect(`https://${host}${req.url}`);
    });
    httpApp.listen(constants_1.HTTP_PORT, () => {
        console.log(`🔗 HTTP redirect server running on port ${constants_1.HTTP_PORT}`);
    });
}
