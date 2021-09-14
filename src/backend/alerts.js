const express = require('express');
const multer = require('multer');

const mapping = require('./data').mapping;
const videos = require('./data').videos;

const alerts = express.Router();

alerts.get('/play/:name', (req, res) => {
    const id = mapping.data[req.params.name];
    if (!id) {
        res.send({ 'error': 'alert not defined' });
        return;
    }
    if (!videos.data[id]) {
        res.send({ 'error': 'alert broken' });
        return;
    }
    module.exports.onplayalert(id);
    res.send({ 'success': true });
});

alerts.get('/list/all', (req, res) => {
    const list = JSON.parse(JSON.stringify(videos.data));
    Object.entries(mapping.data).forEach(([key, value]) => {
        if (!list[value]) return;
        if (!list[value]['events']) list[value]['events'] = [];
        list[value]['events'].push(key);
    });
    res.send(list);
});

alerts.post('/upload', multer({ dest: videos.folder }).single('video'), function (req, res, next) {
    videos.data[req.file.filename] = {
        originalname: req.file.originalname,
        name: req.body.name || req.file.originalname,
        tags: (req.body.tags || '').toString().replace(/,( )*/g, ',').split(',').filter(a => a)
    };
    videos.save();
    res.send({ 'success': true, 'id': req.file.filename, 'info': { ...videos.data[req.file.filename] } });
});

alerts.use('/videos', express.static(videos.folder));
// TODO: generate low res proxies of videos
alerts.use('/videos/proxy', express.static(videos.folder));

module.exports = {
    /**
     * the route for express
     */
    route: alerts,
    /**
     *  a handler that gets called with a video id when an alert should be played
     * @param {*} id video id of alert to play
     */
    onplayalert: (id) => undefined
};