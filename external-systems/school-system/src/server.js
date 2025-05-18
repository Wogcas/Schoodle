"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const constants_1 = require("./config/constants");
app_1.default.listen(constants_1.SERVER_PORT, constants_1.SERVER_HOST, () => {
    console.log(`Server is running on http://${constants_1.SERVER_HOST}:${constants_1.SERVER_PORT}`);
});
