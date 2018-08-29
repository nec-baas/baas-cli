"use strict";

const assert = require('chai').assert;
const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const mocks = require('../mock/mocks');

const Deleter = require('../../lib/deleter');

let deleter;
let req;
let stub;

describe('Deleter', function() {
    beforeEach(function() {
        deleter = new Deleter();
        deleter.process = new mocks.MockProcess();

        req = new mocks.MockHttpRequest();

        stub = sinon.stub(deleter, "createHttpRequest");
        stub.withArgs("/path1").returns(req);
    });

    it('正常に download を実行すること', function(done) {
        req.setResponse("{}");

        deleter.delete("/path1")
            .then(() => {
                req.method.should.equal("DELETE");
                done();
            });
    })
});