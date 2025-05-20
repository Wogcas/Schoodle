"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constants_1 = require("./config/constants");
const system_1 = __importDefault(require("./routes/system"));
const student_1 = __importDefault(require("./routes/student"));
const teacher_1 = __importDefault(require("./routes/teacher"));
const user_1 = __importDefault(require("./routes/user"));
const schoolTerm_1 = __importDefault(require("./routes/schoolTerm"));
const grade_1 = __importDefault(require("./routes/grade"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send(`Welcome to the School System API! call http://${constants_1.SERVER_HOST}:${constants_1.SERVER_PORT}/api/school-system/info to get system information.`);
});
app.use('/api/school-system', system_1.default);
app.use('/api/school-system/students', student_1.default);
app.use('/api/school-system/teachers', teacher_1.default);
app.use('/api/school-system/users', user_1.default);
app.use('/api/school-system/school-terms', schoolTerm_1.default);
app.use('/api/school-system/grades', grade_1.default);
exports.default = app;
