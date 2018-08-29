"use strict";

const assert = require('chai').assert;
const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const mocks = require('../mock/mocks');
const MockFileBucket = mocks.MockFileBucket;

const FileLister = require('../../lib/file_lister');

describe('FileDeleter', function() {
    it('正常に list を実行すること', function(done) {
        const lister = new FileLister();
        lister.nebula = new mocks.MockNebula();
        lister.process = new mocks.MockProcess();

        const mockBucket = new mocks.MockFileBucket("bucket1");
        const stub = sinon.stub(lister, "createBucket");
        stub.withArgs("bucket1").returns(mockBucket);

        MockFileBucket.queue = [];

        lister.list("bucket1")
            .then(() => {
                // todo check stdout
                done();
            });
    })
});