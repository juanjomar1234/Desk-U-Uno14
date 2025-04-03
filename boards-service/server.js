const express = require('express');
const app = express();
const port = 3012;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'boards-service' });
});

app.listen(port, () => {
    console.log('boards-service listening at http://localhost:' + port);
});
