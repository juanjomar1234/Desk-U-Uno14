const express = require('express');
const app = express();
const port = 3016;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'branding-service' });
});

app.listen(port, () => {
    console.log('branding-service listening at http://localhost:' + port);
});
