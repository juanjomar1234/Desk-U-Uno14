const express = require('express');
const app = express();
const port = 3009;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'billing-service' });
});

app.listen(port, () => {
    console.log('billing-service listening at http://localhost:' + port);
});
