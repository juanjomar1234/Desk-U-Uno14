const express = require('express');
const app = express();
const port = 3018;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'crm-service' });
});

app.listen(port, () => {
    console.log('crm-service listening at http://localhost:' + port);
});
