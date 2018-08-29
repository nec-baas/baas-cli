"use strict";

const should = require('chai').should();
const expect = require('chai').expect;

const NebulaInitializer = require('../../lib/nebula_initializer')

let config;

describe('NebulaInitializer', function() {
    beforeEach(function() {
        config = {
            tenant: "TENANT",
            appId: "APP",
            baseUri: "http://localhost:8080/api",
            appKey: "APPKEY",
            masterKey: "MASTERKEY",
            debugMode: "release"
            // proxyなし
        };
    });

    it ('正常に初期化できること', function() {
        const nebula = NebulaInitializer.init(config);

        nebula._config.tenant.should.equal("TENANT");
        nebula._config.appId.should.equal("APP");
        nebula._config.appKey.should.equal("MASTERKEY");
        nebula._config.baseUri.should.equal("http://localhost:8080/api")
        nebula._config.offline.should.equal(false);
    });

    it('HTTP Proxy付きで正常に初期化できること', function() {
        config.proxy = {
            host: "proxy.example.com",
            port: 8080
        };

        NebulaInitializer.init(config);
        // チェック方法なし
    });

    it('HTTPS Proxy付きで正常に初期化できること', function() {
        config.baseUri = "https://localhost:8080/api";
        config.proxy = {
            host: "proxy.example.com",
            port: 8080
        };

        NebulaInitializer.init(config);
        // チェック方法なし
    });
});

