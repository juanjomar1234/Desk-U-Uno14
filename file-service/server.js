const express = require('express');
const app = express();
const port = 3003;

// Endpoint de salud
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'file' });
});

app.listen(port, () => {
    console.log(`File service listening at http://localhost:${port}`);
});
