const express = require('express');
const app = express();
const port = 3000;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'gateway' });
});

app.listen(port, () => {
    console.log('gateway-service listening at http://localhost:' + port);
});
