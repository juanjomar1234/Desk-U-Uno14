const express = require('express');
const app = express();
const port = 3007;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'task-service' });
});

app.listen(port, () => {
    console.log('task-service listening at http://localhost:' + port);
});
