const express = require('express');

const listeners = [];

const api = express.Router();

const alerts = require('./alerts');
api.use('/alerts', alerts.route);
alerts.onplayalert = (url) => listeners.forEach(listener => listener(url));

api.get('/', (req, res) => {
    res.send('Alertable');
});

// server-sent events to stream new alerts
api.get('/listener', (req, res) => {
    // send headers
    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    });
    res.flushHeaders();

    // retry every second if connection is lost
    res.write('retry: 1000\n\n');

    // add listener method to listeners
    const listener = (id) => res.write(`data: ${id}\n\n`);
    listeners.push(listener);

    // remove listener on close
    res.on('close', () => {
        listeners.splice(listeners.indexOf(listener), 1);
        res.end();
    });
});

module.exports = api;