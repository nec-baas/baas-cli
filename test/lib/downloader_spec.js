"use strict";

const assert = require('chai').assert;
const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const fs = require('fs');

const mocks = require('../mock/mocks');

const Downloader = require('../../lib/downloader');

let downloader;
let mockFs;
let req;
let stub;

describe('Downloader', function() {
    beforeEach(function() {
        downloader = new Downloader();
        downloader.process = new mocks.MockProcess();

        req = new mocks.MockHttpRequest();

        stub = sinon.stub(downloader, "createHttpRequest");
        stub.withArgs("/path").returns(req);

        mockFs = new mocks.MockFs();
        downloader.fs = mockFs;
    });

    it('正常に download を実行すること', function(done) {
        req.setResponse(new Buffer("DATA"));

        downloader.download("/path", "out1", null)
            .then(() => {
                req.method.should.equal("GET");
                mockFs.file.should.equal("out1");
                mockFs.data.toString().should.equal("DATA");
                done();
            });
    });

    it('正常に download を実行すること(filter付き)', function(done) {
        req.setResponse(new Buffer("DATA"));
        const opts = {
            filter: function(data) {
                return "FILTERED:" + data;
            }
        };

        downloader.download("/path", "out1", opts)
            .then(() => {
                req.method.should.equal("GET");
                mockFs.file.should.equal("out1");
                mockFs.data.toString().should.equal("FILTERED:DATA");
                done();
            });
    });

    it('正常に download を実行すること(yaml変換)', function(done) {
        req.setResponse(new Buffer("{\"a\":1}"));
        const opts = {
            yaml: true
        };

        downloader.download("/path", "out1", opts)
            .then(() => {
                req.method.should.equal("GET");
                mockFs.file.should.equal("out1");
                mockFs.data.toString().should.equal("a: 1\n");
                done();
            });
    });

    it('正常に download を実行すること(JSONフォーマット付き)', function(done) {
        req.setResponse(new Buffer("{\"a\":1}"));
        const opts = {
            format_json: true
        };

        downloader.download("/path", "out1", opts)
            .then(() => {
                req.method.should.equal("GET");
                mockFs.file.should.equal("out1");
                mockFs.data.toString().should.equal("{\n  \"a\": 1\n}");
                done();
            });
    });

    it('標準出力できること', function(done) {
        req.setResponse(new Buffer("{\"a\":1}"));
        downloader.download("/path", null, null)
            .then(() => {
                req.method.should.equal("GET");
                should.equal(mockFs.file, undefined); // ファイル出力していないこと
                done();
            });
    });
});
