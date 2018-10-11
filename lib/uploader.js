/*
 * NEC Mobile Backend Platform
 *
 * COPYRIGHT (C) 2014-2018 NEC CORPORATION
 */
/**
 * アップローダ
 */
'use strict';

const Util = require('./util');
const Base = require('./base');

class Uploader extends Base {
    upload(path, data, contentType, headers) {
        const req = this.createHttpRequest(path);

        req.setMethod("PUT");
        req.setData(data);
        if (contentType) {
            req.setContentType(contentType);
        }
        if (headers) {
            for (const key in headers) {
                if (headers.hasOwnProperty(key)) {
                    req.setRequestHeader(key, headers[key]);
                }
            }
        }

        return req.execute()
            .then(function (response) {
                //console.log(JSON.stringify(response)); // TODO:
                console.log("Successfully uploaded.");
            })
            .catch(function (error) {
                console.error(Util.errorText(error));
                process.exit(1);
            });
    }
}

module.exports = Uploader;
