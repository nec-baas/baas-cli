"use strict";

const assert = require('chai').assert;
const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const mocks = require('../mock/mocks');
const MockFileBucket = mocks.MockFileBucket;

const FileDownloader = require('../../lib/file_downloader');

describe('FileDownloader', function() {
    it('正常に download を実行すること', function(done) {
        const downloader = new FileDownloader();
        downloader.nebula = new mocks.MockNebula();
        downloader.process = new mocks.MockProcess();

        MockFileBucket.queue = [];

        downloader.download("bucket1", "file1", null)
            .then(() => {
                const bucket = MockFileBucket.queue.shift();
                bucket.name.should.equal("bucket1");
                bucket.filename.should.equal("file1");

                const data = downloader.process.stdout.data.toString();
                data.should.equal("DATA");  // MockFileBucket data

                done();
            });
    })
});
