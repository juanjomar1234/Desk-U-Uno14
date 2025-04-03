const express = require('express');
const app = express();

module.exports = function createService(name, port) {
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', service: name });
    });

    app.listen(port, () => {
        console.log(`${name}-service listening at http://localhost:${port}`);
    });

    return app;
}; 