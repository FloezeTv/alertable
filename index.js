const express = require('express');

const app = express();

// use port from environment or default 80
const port = process.env.PORT | 80;

app.get('/', (req, res) => {
    res.send('Alertable');
});

const server = app.listen(port, () => {
    console.log(`Alertable listening on ${server.address().address}:${server.address().port}`);
});