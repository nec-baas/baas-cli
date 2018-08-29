'use strict';

const GetLog = require('../get_log').GetLog;

class GetCustomLog extends GetLog {

    setProgramOptions(){
        super.setProgramOptions();
        this.program.option("-f, --funcname <funcname>", "function name");
    }

    processOptions() {
        const params = super.processOptions();

        if (this.program.funcname) {
            let where = {};
            if (params.where) {
                where = JSON.parse(params.where);
            }

            where.functionName = this.program.funcname;

            params.where = JSON.stringify(where);
        }

        return params;
    }

    createRequest() {
        const path = "/logs/customlogic"; // v5 + v6 backward compat.
        //const path = "/logs/cloudfn"; // v6 later.
        return new this.nebula.HttpRequest(this.nebula, path);
    }
}

module.exports = GetCustomLog;
