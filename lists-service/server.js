const express = require('express');
const app = express();
const port = 3013;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'lists-service' });
});

app.listen(port, () => {
    console.log('lists-service listening at http://localhost:' + port);
});
