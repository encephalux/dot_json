const fs_p = require("fs/promises");

const file = _path => fs_p.readFile(_path).then(_data => JSON.parse(_data.toString()));

const to_file = (_path, _data) => fs_p.writeFile(_path, JSON.stringify(_data));

const update = (_path, _updater) => file(_path).then(_parsed => _updater(_parsed)).then(_updated => to_file(_path, _updated));

const instance = _path => file(_path).then(_parsed => new class JSON {
    constructor() {
        this.path = _path;
        this.parsed = _parsed;
    }

    async reload() {
        this.parsed = await file(this.path);
        return this.parsed;
    }

    save() {
        return to_file(this.path, this.parsed);
    }

    free() {
        this.parsed = null;
    }
});

module.exports = {file, to_file, update, instance};