const express = require('express');
const app = express();
const port = 3020;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'timeline-service' });
});

app.listen(port, () => {
    console.log('timeline-service listening at http://localhost:' + port);
});
