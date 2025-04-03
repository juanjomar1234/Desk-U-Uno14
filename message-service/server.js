const express = require('express');
const app = express();
const port = 3002;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'message-service' });
});

app.listen(port, () => {
    console.log('message-service listening at http://localhost:' + port);
});
