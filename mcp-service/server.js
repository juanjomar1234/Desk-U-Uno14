const express = require('express');
const app = express();
const port = 3010;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'mcp-service' });
});

app.listen(port, () => {
    console.log('mcp-service listening at http://localhost:' + port);
});
