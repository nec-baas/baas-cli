/*
 * NEC Mobile Backend Platform
 *
 * Copyright (C) 2014-2018, NEC Corporation
 */

'use strict';

const Util = require('./util');
const Base = require('./base');

class FileLister extends Base {
    createBucket(name) {
        return new this.nebula.FileBucket(name);
    }

    list(bucketname) {
        const bucket = this.createBucket(bucketname);

        return bucket.getList()
            .then(function (files) {
                files.forEach((meta) => {
                    console.log(meta.getFileName());
                });
                console.log("---");
                console.log("Number of files = " + files.length);
            })
            .catch(function (error) {
                console.error(Util.errorText(error));
                process.exit(1);
            });
    }
}

module.exports = FileLister;
