const express = require('express');
const app = express();
const port = 3008;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'schedule-service' });
});

app.listen(port, () => {
    console.log('schedule-service listening at http://localhost:' + port);
});
