'use strict';

class BaseManager {
    constructor() {
        this.program = require('commander'); // for test
        this.process = process; // global
    }

    exit(code) {
        this.process.exit(code);
    }
}

module.exports = BaseManager;
