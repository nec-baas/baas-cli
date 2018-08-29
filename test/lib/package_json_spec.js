"use strict";

const should = require('chai').should();
const expect = require('chai').expect;

const PackageJson = require('../../lib/package_json');

describe("PackageJson", function() {
    it("正常にパースできること", function() {
        const data = {
            name: "name",
            version: "1.0.0"
        };

        const pkg = new PackageJson();
        pkg.parsePackageJson(JSON.stringify(data));

        pkg.name.should.equal("name");
        pkg.version.should.equal("1.0.0");
    });
});
