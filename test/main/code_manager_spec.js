"use strict";

const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const resetCommander = require('../utils/reset_commander');

const CodeManager = require('../../lib/main/code_manager');
const FileUploader = require('../../lib/file_uploader');
const FileDownloader = require('../../lib/file_downloader');
const FileLister = require('../../lib/file_lister');
const FileDeleter = require('../../lib/file_deleter');

const mocks = require('../mock/mocks');
const MockProcess = mocks.MockProcess;

let manager;
let uploader;
let downloader;
let lister;
let deleter;
let mockFs;

describe('CodeManager', function() {
    describe('Create/Update Code', function () {
        beforeEach(function () {
            resetCommander();
            manager = new CodeManager();
            manager.fs = new mocks.MockFs();

            uploader = new FileUploader();

            mockFs = sinon.mock(manager.fs);
            mockFs.expects("readFileSync").withArgs("code-1.0.0.tgz").returns("DATA");
        });

        it("正常に新規登録すること", function () {
            const mockUploader = sinon.mock(uploader);
            mockUploader.expects("upload").withArgs("CUSTOM_CODE", "code-1.0.0.tgz", "DATA"/*sinon.match.any*/,
                "application/gzip", true).returns(null);

            manager.process = new MockProcess("-f code-1.0.0.tgz");
            manager.createUpdate(uploader, true);

            mockFs.verify();
            mockUploader.verify();
        });

        it("正常に更新すること", function () {
            const mockUploader = sinon.mock(uploader);
            mockUploader.expects("upload").withArgs("CUSTOM_CODE", "code-1.0.0.tgz", "DATA"/*sinon.match.any*/,
                "application/gzip", false).returns(null);

            manager.process = new MockProcess("-f code-1.0.0.tgz");
            manager.createUpdate(uploader, false);

            mockFs.verify();
            mockUploader.verify();
        });

        it("バケットオプション指定", function () {
            const mockUploader = sinon.mock(uploader);
            mockUploader.expects("upload").withArgs("bucket1", "code-1.0.0.tgz", "DATA"/*sinon.match.any*/,
                "application/gzip", true).returns(null);

            manager.process = new MockProcess("-b bucket1 -f code-1.0.0.tgz");
            manager.createUpdate(uploader, true);

            mockFs.verify();
            mockUploader.verify();
        });

        it("ファイル自動指定", function () {
            // CodeUtil 側を stub する
            sinon.stub(manager.codeUtil, "resolveCodeFilePath").returns("code-1.0.0.tgz");

            const mockUploader = sinon.mock(uploader);
            mockUploader.expects("upload").withArgs("CUSTOM_CODE", "code-1.0.0.tgz", "DATA"/*sinon.match.any*/,
                "application/gzip", true).returns(null);

            manager.process = new MockProcess("");
            manager.createUpdate(uploader, true);

            mockFs.verify();
            mockUploader.verify();
        });
    });

    describe("Download", function() {
        beforeEach(function () {
            resetCommander();
            manager = new CodeManager();
            downloader = new FileDownloader();
        });

        it("正常にダウンロードできること", function() {
            sinon.mock(downloader).expects("download").withArgs("CUSTOM_CODE", "code-1.0.0.tgz", undefined);

            manager.process = new MockProcess("code-1.0.0.tgz");
            manager.download(downloader);
        });

        it("バケット名指定・ファイル指定付きでダウンロードできること", function() {
            sinon.mock(downloader).expects("download").withArgs("bucket1", "code-1.0.0.tgz", "out.tgz");

            manager.process = new MockProcess("-b bucket1 -o out.tgz code-1.0.0.tgz");
            manager.download(downloader);
        });
    });

    describe("List", function() {
        beforeEach(function () {
            resetCommander();
            manager = new CodeManager();
            lister = new FileLister();
        });

        it("正常にリスト取得できること", function() {
            sinon.mock(lister).expects("list").withArgs("CUSTOM_CODE");

            manager.process = new MockProcess(null);
            manager.list(lister);
        });

        it("バケット指定付きで正常にリスト取得できること", function() {
            sinon.mock(lister).expects("list").withArgs("bucket1");

            manager.process = new MockProcess("-b bucket1");
            manager.list(lister);
        });
    });

    describe("Delete", function() {
        beforeEach(function () {
            resetCommander();
            manager = new CodeManager();
            deleter = new FileDeleter();
        });

        it("正常に削除できること", function() {
            sinon.mock(deleter).expects("delete").withArgs("CUSTOM_CODE", "code-1.0.0.tgz");

            manager.process = new MockProcess("code-1.0.0.tgz");
            manager.delete(deleter);
        });

        it("バケット指定付きで正常に削除できること", function() {
            sinon.mock(deleter).expects("delete").withArgs("bucket1", "code-1.0.0.tgz");

            manager.process = new MockProcess("-b bucket1 code-1.0.0.tgz");
            manager.delete(deleter);
        });
    });
});
