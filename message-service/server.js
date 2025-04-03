const express = require('express');
const app = express();
const port = 3002;

// Endpoint de salud
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'message' });
});

app.listen(port, () => {
    console.log(`Message service listening at http://localhost:${port}`);
});
