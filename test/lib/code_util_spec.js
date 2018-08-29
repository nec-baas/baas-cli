"use strict";

const assert = require('chai').assert;
const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const mocks = require('../mock/mocks');

const CodeUtil = require('../../lib/code_util');

let codeUtil;

describe('CodeUtil', function() {
    beforeEach(function() {
        codeUtil = new CodeUtil();
    });
    it('resolveCodeFilePath - ファイル指定あり', function() {
        codeUtil.setOpts({file: "file1"});

        codeUtil.resolveCodeFilePath().should.equal("file1");
    });

    it('resolveCodeFilePath - ファイル指定なし/name-versionあり', function() {
        codeUtil.setOpts({name: "name", version:"1.0.0"});

        codeUtil.resolveCodeFilePath().should.equal("name-1.0.0.tgz");
    });

    it('resolveCodeFilePath - ファイル/name/version指定なし', function() {
        codeUtil.setOpts({});

        const pkgJson = codeUtil.pkgJson;
        const stub = sinon.stub(pkgJson, "readPackageJsonFromCwd");
        stub.returns();

        pkgJson.name = "name";
        pkgJson.version = "1.0.0";

        codeUtil.resolveCodeFilePath().should.equal("name-1.0.0.tgz");
    });

    it('resolveContentType', function() {
        codeUtil.resolveContentType("foo.jar").should.equal("application/java-archive");
    })

    it('resolveContentType', function() {
        codeUtil.resolveContentType("foo.tgz").should.equal("application/gzip");
    })

    it('resolveContentType', function() {
        codeUtil.resolveContentType("foo.txt").should.equal("application/octet-stream");
    })
});