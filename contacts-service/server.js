const express = require('express');
const app = express();
const port = 3011;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'contacts-service' });
});

app.listen(port, () => {
    console.log('contacts-service listening at http://localhost:' + port);
});
