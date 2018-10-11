/*
 * NEC Mobile Backend Platform
 *
 * COPYRIGHT (C) 2014-2018 NEC CORPORATION
 */
'use strict';

const fs = require('fs');
const Util = require('./util');
const Base = require('./base');

class FileDownloader extends Base {
    download(bucketname, filename, outfile) {
        const bucket = new this.nebula.FileBucket(bucketname);

        return bucket.load(filename)
            .then((buffer) => {
                if (outfile) {
                    fs.writeFileSync(outfile, buffer);
                    console.log("Successfully downloaded.");
                } else {
                    //fs.writeFileSync(1, buffer);
                    this.process.stdout.write(buffer);
                }
            })
            .catch((error) => {
                console.error(Util.errorText(error));
                this.process.exit(1);
            });
    }
}

module.exports = FileDownloader;
