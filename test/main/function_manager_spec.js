"use strict";

const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const resetCommander = require('../utils/reset_commander');

const FunctionManager = require('../../lib/main/function_manager');

const mocks = require('../mock/mocks');
const MockProcess = mocks.MockProcess;
const MockUploader = mocks.MockUploader;
const MockDownloader = mocks.MockDownloader;

let manager;
let uploader;
let downloader;
let deleter;

describe('functionManager', function() {
    describe('Create', function () {
        beforeEach(function () {
            resetCommander();
            uploader = new MockUploader();
            manager = new FunctionManager();
        });

        it("引数なしのときにファイル名無しエラーとなること", function () {
            manager.process = new MockProcess(null);
            (() => manager.create(uploader)).should.throw("exit 1");
        });

        it("正常に登録すること", function () {
            const functionJson = {handler: "handler1"};

            sinon.mock(manager).expects("loadFile").withArgs("func1.yaml").returns(JSON.stringify({func1: functionJson}));

            sinon.mock(uploader).expects("upload").withArgs("/functions/func1", functionJson, "application/json");

            manager.process = new MockProcess("func1.yaml");
            manager.create(uploader);
        });

        it("Function定義内にエントリが1個もないときにエラーになること", function () {
            sinon.mock(manager).expects("loadFile").withArgs("func1.yaml").returns("{}"); // no entries

            manager.process = new MockProcess("func1.yaml");
            (() => manager.create(uploader)).should.throw("exit 1");
        });

        it("Function定義内にエントリが2個以上あるときにエラーになること", function () {
            sinon.mock(manager).expects("loadFile").withArgs("func1.yaml").returns(JSON.stringify({f1: {}, f2: {}})); // two entries

            manager.process = new MockProcess("func1.yaml");
            (() => manager.create(uploader)).should.throw("exit 1");
        });
    });

    describe('Import', function () {
        beforeEach(function () {
            resetCommander();
            manager = new FunctionManager();
            uploader = new mocks.MockUploader();
        });

        it('正常にインポートすること', function () {
            manager.process = new MockProcess("--noconfirm functions.yaml");

            const functions = {f1: {}, f2: {}};
            sinon.mock(manager).expects("loadFile").withArgs("functions.yaml").returns(JSON.stringify(functions));
            sinon.mock(uploader).expects("upload").withArgs("/functions", functions, "application/json");

            manager.importFunctions(uploader);
        });

        it('ファイル名指定がないときにエラーになること', function () {
            manager.process = new MockProcess(null);
            (() => manager.importFunctions(uploader)).should.throw("exit 1");
        });
    });

    describe('Download', function () {
        beforeEach(function () {
            resetCommander();
            manager = new FunctionManager();
            downloader = new mocks.MockDownloader();
        });

        it("ファイル名指定がないときにエラーになること", function () {
            manager.process = new MockProcess(null);
            (() => manager.download(downloader)).should.throw("exit 1");
        });

        it("正常にダウンロードできること", function () {
            manager.process = new MockProcess("func1");
            manager.download(downloader);

            downloader.req.should.equal("/functions/func1");
            should.equal(downloader.outfile, undefined);
            const output = downloader.opts.filter("{}");
            output.should.equal("{\n  \"func1\": {}\n}");
        });

        it("YAML形式で正常にダウンロードできること", function () {
            manager.process = new MockProcess("-y func1");
            manager.download(downloader);

            downloader.req.should.equal("/functions/func1");
            should.equal(downloader.outfile, undefined);
            const output = downloader.opts.filter("{}");
            output.should.equal("func1: {}\n");
        });
    });

    describe('Export', function () {
        beforeEach(function () {
            resetCommander();
            manager = new FunctionManager();
            downloader = new mocks.MockDownloader();
        });

        it("正常にエクスポートできること", function () {
            sinon.mock(downloader).expects("download").withArgs("/functions", undefined, {
                format_json: true,
                yaml: undefined
            });
            manager.process = new MockProcess("");
            manager.exportFunctions(downloader);
        });

        it("ファイル指定ありでエクスポートできること", function () {
            sinon.mock(downloader).expects("download").withArgs("/functions", "out", {
                format_json: true,
                yaml: undefined
            });
            manager.process = new MockProcess("-o out");
            manager.exportFunctions(downloader);
        });

        it("YAML形式でエクスポートできること", function () {
            sinon.mock(downloader).expects("download").withArgs("/functions", "out", {format_json: true, yaml: true});
            manager.process = new MockProcess("-o out -y");
            manager.exportFunctions(downloader);
        });
    });

    describe('Delete', function () {
        beforeEach(function () {
            resetCommander();
            manager = new FunctionManager();
            deleter = new mocks.MockDeleter();
        });

        it("正常に削除できること", function () {
            sinon.mock(deleter).expects("delete").withArgs("/functions/func1");
            manager.process = new MockProcess("func1");
            manager.delete(deleter);
        });

        it("ファンクション名指定しないとエラーになること", function () {
            manager.process = new MockProcess("");
            (() => manager.delete(deleter)).should.throw("exit 1");
        });
    });

    describe('DeleteAll', function () {
        beforeEach(function () {
            resetCommander();
            manager = new FunctionManager();
            deleter = new mocks.MockDeleter();
        });

        it("正常に削除できること", function () {
            sinon.mock(deleter).expects("delete").withArgs("/functions/");
            manager.process = new MockProcess("--noconfirm");
            manager.deleteAll(deleter);
        });
    });
});


