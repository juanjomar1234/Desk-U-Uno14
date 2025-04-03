const express = require('express');
const app = express();
const port = 3003;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'file-service' });
});

app.listen(port, () => {
    console.log('file-service listening at http://localhost:' + port);
});
