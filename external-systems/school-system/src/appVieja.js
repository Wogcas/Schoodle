const express = require('express');
const app = express();

const { SERVER_HOST: HOST, SERVER_PORT: PORT} = require('./config/constants');
/**
    const gradesRouter = require('./routes/grades');
    const violationsRouter = require('./routes/violations');
*/
const systemRouter = require('./routes/system');

app.use(express.json()); // Middleware to parse JSON requests
/**
    app.use('/api/school-system/grades', gradesRouter);
    app.use('/api/school-system/violations', violationsRouter);
*/
app.use('/api/school-system', systemRouter);

// Basic route
app.get('/', (req, res) => {
    res.send(`Welcome to the School System API! call http://${HOST}:${PORT}/api/school-system/info to get system information.`);
});

// Start the server
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});