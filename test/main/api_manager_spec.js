"use strict";

const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const resetCommander = require('../utils/reset_commander');

const ApiManager = require('../../lib/main/api_manager');
const Util = require('../../lib/util');

const mocks = require('../mock/mocks');
const MockProcess = mocks.MockProcess;
const MockUploader = mocks.MockUploader;
const MockDownloader = mocks.MockDownloader;

let manager;
let uploader;
let downloader;
let deleter;

describe('ApiManager', function() {
    describe('Create API', function () {
        beforeEach(function () {
            resetCommander();
            uploader = new MockUploader();
            manager = new ApiManager();
        });

        it("引数なしのときにファイル名無しエラーとなること", function () {
            manager.process = new MockProcess(null);
            (() => manager.create(uploader)).should.throw("exit 1");
        });

        it("正常に登録すること、apiname は basePath の最後の要素となること", function () {
            manager.process = new MockProcess("test/fixture/api1.yaml");
            manager.create(uploader);

            uploader.path.should.equal("/apigw/apis/api1");
            const apiJson = Util.parseJsonOrYaml(uploader.data, null);
            apiJson.basePath.should.equal("https://api.example.com/api/1/xxxxx/api/api1");
            uploader.contentType.should.equal("text/plain");
        });

        it("Swagger 定義に apiname がない場合はエラーになること", function () {
            manager.process = new MockProcess("test/fixture/api-noname.yaml");
            (() => manager.create(uploader)).should.throw("exit 1");
        });
    });

    describe('Create Multi', function() {
        beforeEach(function () {
            resetCommander();
            uploader = new MockUploader();
            manager = new ApiManager();
        });

        it("正常に複数登録できること", function() {
            const apiJson = {};
            sinon.mock(manager).expects("loadFile").withArgs("apis.yaml").returns(JSON.stringify(apiJson));
            sinon.mock(uploader).expects("upload").withArgs("/apigw/apis/", apiJson, "application/json");
            manager.process = new MockProcess("apis.yaml");
            manager.createMulti(uploader);
        });

        it("引数無し時にエラーになること", function() {
            manager.process = new MockProcess("");
            (() => manager.createMulti(uploader)).should.throw("exit 1");
        });
    });

    describe('ListApis', function() {
        beforeEach(function() {
            resetCommander();
            downloader = new MockDownloader();
            manager = new ApiManager();
        });

        it("引数なしで正常に実行できること", function() {
            sinon.mock(downloader).expects("download").withArgs("/apigw/apis", undefined, {format_json:true, yaml:undefined});

            manager.process = new MockProcess("");
            manager.list(downloader);
        });

        it("--out オプションを正常に受け付けること", function() {
            sinon.mock(downloader).expects("download").withArgs("/apigw/apis", "file1.json", {format_json:true, yaml:undefined});

            manager.process = new MockProcess("--out file1.json");
            manager.list(downloader);
        });

        it("--yaml オプションを正常に受け付けること", function() {
            sinon.mock(downloader).expects("download").withArgs("/apigw/apis", undefined, {format_json:true, yaml:true});

            manager.process = new MockProcess("--yaml");
            manager.list(downloader);
        });
    });

    describe('Get', function() {
        beforeEach(function() {
            resetCommander();
            manager = new ApiManager();
            downloader = new MockDownloader();
        });

        it("引数なしで正常に実行できること", function() {
            sinon.mock(downloader).expects("download")
                .withArgs("/apigw/apis/api1", undefined, {format_json:false, yaml:false}, {format: "text"});
            manager.process = new MockProcess("api1");
            manager.get(downloader);
        });

        it("ファイル名指定で正常に実行できること", function() {
            sinon.mock(downloader).expects("download")
                .withArgs("/apigw/apis/api1", "file1.json", {format_json:false, yaml:false}, {format: "text"});
            manager.process = new MockProcess("-o file1.json api1");
            manager.get(downloader);
        });

        it("YAML形式で正常に実行できること", function() {
            sinon.mock(downloader).expects("download")
                .withArgs("/apigw/apis/api1", "file1.yaml", {format_json:true, yaml:true});
            manager.process = new MockProcess("-o file1.yaml -y api1");
            manager.get(downloader);
        });

        it("JSON形式で正常に実行できること", function() {
            sinon.mock(downloader).expects("download")
                .withArgs("/apigw/apis/api1", "file1.yaml", {format_json:true, yaml:undefined});
            manager.process = new MockProcess("-o file1.yaml -j api1");
            manager.get(downloader);
        });
    });

    describe('Delete', function() {
        beforeEach(function() {
            resetCommander();
            manager = new ApiManager();
            deleter = new mocks.MockDeleter();
        });

        it("正常に削除できること", function() {
            sinon.mock(deleter).expects("delete").withArgs("/apigw/apis/api1");

            manager.process = new MockProcess("api1");
            manager.delete(deleter);
        });

        it("引数無し時にエラーになること", function() {
            manager.process = new MockProcess(null);
            (() => manager.delete(deleter)).should.throw("exit 1");
        });
    });

    describe('Delete All', function() {
        beforeEach(function() {
            resetCommander();
            manager = new ApiManager();
            deleter = new mocks.MockDeleter();
        });

        it("正常に全削除できること", function() {
            sinon.mock(deleter).expects("delete").withArgs("/apigw/apis/");

            manager.process = new MockProcess("--noconfirm");
            manager.deleteAll(deleter);
        });
    })
});
