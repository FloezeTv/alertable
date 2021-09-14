const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const mapping = require('./data').mapping;
const videos = require('./data').videos;

const proxyWait = {};

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
    proxyWait[req.file.filename] = new Promise((resolve, reject) => {
        ffmpeg(req.file.path)
            .noAudio()
            .size('?x144')
            .format('mp4')
            .on('end', () => {
                resolve(null);
                delete proxyWait[req.file.filename];
            })
            .on('error', reject)
            .save(path.join(videos.proxyFolder, req.file.filename));
    });
    res.send({ 'success': true, 'id': req.file.filename, 'info': { ...videos.data[req.file.filename] } });
});

alerts.get('/videos/proxy/:id', (req, res) => {
    (proxyWait[req.params.id] || Promise.resolve(null)).then(() => {
        res.sendFile(path.join(videos.proxyFolder, req.params.id), { acceptRanges: false });
    });
});
alerts.use('/videos', express.static(videos.folder));

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