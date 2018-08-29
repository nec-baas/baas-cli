"use strict";

const assert = require('chai').assert;
const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const mocks = require('../mock/mocks');

const Uploader = require('../../lib/uploader');

describe('Uploader', function() {
    it('正常に upload を実行すること', function(done) {
        const uploader = new Uploader();

        const req = new mocks.MockHttpRequest();
        req.setResponse({});

        const stub = sinon.stub(uploader, "createHttpRequest");
        stub.withArgs("/path").returns(req);

        uploader.upload("/path", "DATA", "application/json", {"X-foo": 1})
            .then((response) => {
                req.method.should.equal("PUT");
                req.data.should.equal("DATA");
                req.contentType.should.equal("application/json");
                console.log(req.headers);
                req.headers.should.deep.equal({"X-foo": 1});
                done();
            });
    })
});
