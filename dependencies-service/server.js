const express = require('express');
const app = express();
const port = 3019;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'dependencies-service' });
});

app.listen(port, () => {
    console.log('dependencies-service listening at http://localhost:' + port);
});
