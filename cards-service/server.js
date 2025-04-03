const express = require('express');
const app = express();
const port = 3014;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'cards-service' });
});

app.listen(port, () => {
    console.log('cards-service listening at http://localhost:' + port);
});
