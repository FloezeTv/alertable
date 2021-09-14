const express = require('express');

const alerts = express.Router();

alerts.get('/play/:name', (req, res) => {
    // TODO: map name to url
    module.exports.onplayalert(req.params.name);
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