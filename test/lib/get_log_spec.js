"use strict";

const assert = require('chai').assert;
const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const mocks = require('../mock/mocks');

const GetLog = require('../../lib/get_log').GetLog;
const resetCommander = require('../utils/reset_commander');

let getLog;

describe('GetLog', function() {
    beforeEach(function() {
        resetCommander();
        getLog = new GetLog();
    });

    it('formatLog simple', function() {
        getLog.format = 'simple';
        const log = {
            time: 0,
            level: 'INFO',
            logger: 'logger1',
            thread: 'th1',
            log: 'msg1'
        };
        const msg = getLog.formatLog(log);
        msg.should.have.string("INFO [th1] logger1 - msg1");
        msg.should.have.string("1970");
    });

    /*
    it('formatLog json', function() {
        getLog.format = 'json';
        const log = {
            time: 0,
            level: 'INFO',
            logger: 'logger1',
            thread: 'th1',
            message: 'msg1'
        };
        const msg = getLog.formatLog(log);
        msg.should.deep.equal(log);
    });
    */

    it ('exec', function(done) {
        const process = new mocks.MockProcess("-t json -l 100");
        const req = new mocks.MockHttpRequest(null, "/path1");

        req.setResponse(JSON.stringify({
            results: ["log1"]
        }));

        const stub = sinon.stub(getLog, "createRequest");
        stub.returns(req);

        getLog.exec(process)
            .then(() => {
                getLog.format.should.equal("json");
                req.method.should.equal("GET");
                req.queryParams.should.deep.equal({
                    limit: "100"
                });
                done();
            });
    });

    const parseOpts = function(cmd) {
        resetCommander();
        const log = new GetLog();

        log.setProgramOptions();
        log.program.parse(new mocks.MockProcess(cmd).argv);
        return log;
    };

    it ('正しく引数処理されること', function() {
        // short options:  -l, -t, -L, -s, -e
        const expected1 = {
            start: "2016-01-01T00:00:00.000Z",
            end: "2016-12-31T23:59:59.000Z",
            limit: "100",
            where: JSON.stringify({level: {"$in": ["ERROR", "WARN"]}})
        };
        let log;

        log = parseOpts("-l 100 -t json -L ERROR,WARN -s 2016-01-01T00:00:00Z -e 2016-12-31T23:59:59Z");
        log.processOptions().should.deep.equal(expected1);

        // long options
        log = parseOpts("--limit 100 --format json --level ERROR,WARN --start 2016-01-01T00:00:00Z --end 2016-12-31T23:59:59Z");
        log.processOptions().should.deep.equal(expected1);

        // -r option
        log = parseOpts("-r 100");
        let opts = log.processOptions();
        opts.start.should.match(/^20\d\d-/);

        log = parseOpts("--recent 100");
        opts = log.processOptions();
        opts.start.should.match(/^20\d\d-/);

        // -q option
        log = parseOpts("-q {\"key\":1}");
        opts = log.processOptions();
        opts.should.deep.equal({where: JSON.stringify({key: 1})});

        // -q with -L
        log = parseOpts("--query {\"key\":1} -L INFO")
        opts = log.processOptions();
        opts.should.deep.equal({where: JSON.stringify({
            key: 1,
            level: {
                "$in": ["INFO"]
            }
        })});
    });
});
