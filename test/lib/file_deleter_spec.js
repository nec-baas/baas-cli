"use strict";

const assert = require('chai').assert;
const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const mocks = require('../mock/mocks');
const MockFileBucket = mocks.MockFileBucket;

const FileDeleter = require('../../lib/file_deleter');

describe('FileDeleter', function() {
    it('正常に削除を実行すること', function(done) {
        const deleter = new FileDeleter();
        deleter.nebula = new mocks.MockNebula();
        deleter.process = new mocks.MockProcess();

        MockFileBucket.queue = [];

        deleter.delete("bucket1", "file1")
            .then(() => {
                const bucket = MockFileBucket.queue.shift();
                bucket.name.should.equal("bucket1");
                bucket.filename.should.equal("file1");

                done();
            });
    })
});