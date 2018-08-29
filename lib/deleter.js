/*
 * NEC Mobile Backend Platform
 *
 * Copyright (C) 2014-2018, NEC Corporation
 */
/**
 * DELETE REST 呼び出し
 */
'use strict';

const Util = require('./util');
const Base = require('./base');

class Deleter extends Base {
    delete(path) {
        const req = this.createHttpRequest(path);
        req.setMethod("DELETE");

        return req.execute()
            .then(function (response) {
                console.log("Successfully deleted.");
            })
            .catch(function (error) {
                console.error(Util.errorText(error));
                process.exit(1);
            });
    }
}

module.exports = Deleter;
