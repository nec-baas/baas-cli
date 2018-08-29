'use strict';

class Base {
    init() {
        this.nebula = require("../lib/nebula_initializer").init();
        this.process = process; // global
        return this;
    }

    createHttpRequest(path) {
        return new this.nebula.HttpRequest(this.nebula, path);
    }
}

module.exports = Base;
