"use strict";

const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const ConfigLoader = require('../../lib/config_loader');

describe('ConfigLoader', function() {
    it("正常に設定を読み込めること", function() {
        const config = new ConfigLoader().load(`${__dirname}/../config`, "nebula_config.yaml");

        config.tenant.should.equal("TENANT");
        // TODO:
    });

    it("ディレクトリを指定しない場合にホームディレクトリを探索すること", function() {
        const loader = new ConfigLoader();

        const home = process.env["HOME"];

        // loadConfig を mock する
        const mock = sinon.mock(loader);
        mock.expects("loadConfig").returns(null); // 1st call: current dir
        mock.expects("loadConfig").withArgs(home, ["nebula_config.yaml"]).returns({a:1}); // 2nd call

        const config = loader.load(null, "nebula_config.yaml");
        config.should.deep.equal({a:1});

        mock.verify();
    });

    it("ファイル名を指定しない場合にデフォルトのファイルを探索すること", function() {
        const loader = new ConfigLoader();

        // loadConfig を mock する
        const mock = sinon.mock(loader);
        mock.expects("loadConfig").withArgs("/dir", ["nebula_config.yaml", "nebula_config.json"]).returns({a:1});

        const config = loader.load("/dir", null);
        config.should.deep.equal({a:1});

        mock.verify();
    });
});