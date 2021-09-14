const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const dataFolder = path.join(process.cwd(), 'data');
fs.mkdirSync(dataFolder, { recursive: true });

const videoFolder = path.join(dataFolder, 'videos');
fs.mkdirSync(videoFolder, { recursive: true });

const videoProxyFolder = path.join(videoFolder, 'proxy');
fs.mkdirSync(videoProxyFolder, { recursive: true });

/**
 * Reads a json file and returns the content as an object or an empty object if not exists
 * @param {String | fs.PathLike} file file to read
 * @returns the content of the file or an empty object
 */
const loadJSON = (file) => {
    try {
        return JSON.parse(fs.readFileSync(file));
    } catch (err) {
        return {};
    }
}

const save = (file, content) => fsp.writeFile(file, content);

const saveJSON = (file, content) => save(file, JSON.stringify(content, null, 4));


const createExportObject = (file, read, write) => ({
    data: read(file),
    save: function () {
        write(file, this.data);
    }
});

const createExportObjectJSON = (file) => createExportObject(file, loadJSON, saveJSON);


module.exports = {
    mapping: createExportObjectJSON(path.join(dataFolder, 'mapping.json')),
    videos: {...createExportObjectJSON(path.join(dataFolder, 'videos.json')), folder: videoFolder, proxyFolder: videoProxyFolder},
};