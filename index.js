const path = require('path');
const express = require('express');

const app = express();

// use port from environment or default 80
const port = process.env.PORT | 80;

// frontend
app.use(express.static('src/frontend'));

// the api
app.use('/api', require('./src/backend'));

const server = app.listen(port, () => {
    console.log(`Alertable listening on ${server.address().address}:${server.address().port}`);
});