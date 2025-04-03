const express = require('express');
const app = express();
const port = 3015;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'collaboration-service' });
});

app.listen(port, () => {
    console.log('collaboration-service listening at http://localhost:' + port);
});
