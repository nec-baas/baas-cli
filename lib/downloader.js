/*
 * NEC Mobile Backend Platform
 *
 * COPYRIGHT (C) 2014-2016 NEC CORPORATION
 */
'use strict';

const fs = require('fs');
const Util = require('./util');
const Base = require('./base');

class Downloader extends Base {
    init() {
        super.init();
        this.process = process;
        this.fs = fs;
        return this;
    }

    download(path, outfile, opts, queryParams) {
        opts = opts || {};

        const req = this.createHttpRequest(path);
        req.setMethod("GET");
        if (queryParams != null) {
            req.setQueryParams(queryParams)
        }

        return req.execute()
            .then((data) => {
                if (opts.filter) {
                    data = opts.filter(data);
                }
                if (opts.yaml) {
                    data = Util.jsonToYaml(JSON.parse(data));
                }
                else if (opts.format_json) {
                    data = JSON.stringify(JSON.parse(data), null, "  ");
                }
                if (outfile) {
                    this.fs.writeFileSync(outfile, data);
                    console.log("Successfully downloaded.");
                } else {
                    //fs.writeFileSync(1, data);
                    this.process.stdout.write(data);
                }
            })
            .catch(function (error) {
                console.error(Util.errorText(error));
                this.process.exit(1);
            });
    }
}

module.exports = Downloader;
