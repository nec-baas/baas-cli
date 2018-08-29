/*
 * NEC Mobile Backend Platform
 *
 * Copyright (C) 2014-2018, NEC Corporation
 */
/**
 * ファイル削除
 */
'use strict';

const Util = require('./util');
const Base = require('./base');

class FileDeleter extends Base {
    delete(bucketname, filename) {
        const bucket = new this.nebula.FileBucket(bucketname);

        return bucket.remove(filename)
            .then(function (_filename) {
                console.log("Successfully deleted.");
            })
            .catch(function (error) {
                console.error(Util.errorText(error));
                process.exit(1);
            });
    }
}

module.exports = FileDeleter;
