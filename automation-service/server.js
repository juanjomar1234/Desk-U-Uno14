const express = require('express');
const app = express();
const port = 3017;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'automation-service' });
});

app.listen(port, () => {
    console.log('automation-service listening at http://localhost:' + port);
});
