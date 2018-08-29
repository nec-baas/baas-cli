"use strict";

const assert = require('chai').assert;
const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const mocks = require('../mock/mocks');
const MockFileBucket = mocks.MockFileBucket;

const FileUploader = require('../../lib/file_uploader');

describe('FileUploader', function() {
    it('正常に新規 upload を実行すること', function(done) {
        const uploader = new FileUploader();
        uploader.nebula = new mocks.MockNebula();

        MockFileBucket.queue = [];

        uploader.upload("bucket1", "file1", "DATA", "text/plain", true)
            .then((response) => {
                const mockBucket = MockFileBucket.queue.shift();
                mockBucket.name.should.equal("bucket1");
                mockBucket.data.should.equal("DATA");
                const metadata = mockBucket.metadata;
                metadata.getFileName().should.equal("file1");
                metadata.getContentType().should.equal("text/plain");
                done();
            });
    });

    it('正常に更新 upload を実行すること', function(done) {
        const uploader = new FileUploader();
        uploader.nebula = new mocks.MockNebula();

        MockFileBucket.queue = [];

        uploader.upload("bucket1", "file1", "DATA", "text/plain", false)
            .then((response) => {
                const mockBucket = MockFileBucket.queue.shift();
                mockBucket.name.should.equal("bucket1");
                done();
            });
    });

    it('バケットが存在しない場合にバケットを作成してから正常に upload を実行すること', function(done) {
        const uploader = new FileUploader();
        uploader.nebula = new mocks.MockNebula();

        // stub loadBucket
        const stub = sinon.stub(uploader.nebula.FileBucket, "loadBucket");
        stub.withArgs("bucket1").returns(Promise.reject("no such bucket"));

        MockFileBucket.queue = [];

        uploader.upload("bucket1", "file1", "DATA", "text/plain", true)
            .then((response) => {
                const mockBucket = MockFileBucket.queue.shift();
                mockBucket.name.should.equal("bucket1");
                mockBucket.saveBucketCalled.should.equal(true);
                done();
            });
    });
});
