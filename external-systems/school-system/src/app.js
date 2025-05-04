const express = require('express');
const app = express();

const gradesRouter = require('./routes/grades');
const violationsRouter = require('./routes/violations');

const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON requests
app.use('/api/grades', gradesRouter);
app.use('/api/violations', violationsRouter);

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the School System API!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});