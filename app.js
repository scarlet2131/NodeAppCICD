// const express = require('express');
// const path = require('path');
// const app = express();
// const port = 3000;

// // Serve static files
// app.use(express.static(path.join(__dirname, 'public')));

// // Default route
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.listen(port, () => {
//     console.log(`App running at http://localhost:${port}`);
// });
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});

// Export app for testing
export default app;
