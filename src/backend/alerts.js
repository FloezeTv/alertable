const express = require('express');

const mapping = require('./data').mapping;

const alerts = express.Router();

alerts.get('/play/:name', (req, res) => {
    const url = mapping.data[req.params.name];
    if (!url) {
        res.send({ 'error': 'alert not defined' });
        return;
    }
    module.exports.onplayalert(url);
    res.send({ 'success': true });
});

module.exports = {
    /**
     * the route for express
     */
    route: alerts,
    /**
     *  a handler that gets called with a url when an alert should be played
     * @param {*} url url of alert to play
     */
    onplayalert: (url) => undefined
};