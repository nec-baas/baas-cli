"use strict";

const should = require('chai').should();
const expect = require('chai').expect;

const Util = require("../../lib/util");

describe('Util', function() {
    it("jsonToYaml", function() {
        const json = {a:1, b:2};
        const yaml = Util.jsonToYaml(json);

        yaml.should.equal("a: 1\nb: 2\n");
    });

    it("loadJsonOrYaml - YAML", function() {
        const yaml = Util.loadJsonOrYaml("test/fixture/yaml1.yaml");
        yaml.should.deep.equal({a:1, b:2});
    });

    it("loadJsonOrYaml - JSON", function() {
        const yaml = Util.loadJsonOrYaml("test/fixture/json1.json");
        yaml.should.deep.equal({a:1, b:2});
    });

    it("loadJsonOrYaml - No file", function() {
        try {
            Util.loadJsonOrYaml("not_exists");
        } catch (e) {
            console.log(e);
        }
    });

    it ("errorText - string", function() {
        Util.errorText("TEXT").should.equal("TEXT");
    });

    it ("errorText - with message", function() {
        Util.errorText({message: "MSG"}).should.equal("MSG");
    });

    it ("errorText - with status/statusText", function() {
        Util.errorText({status: 500, statusText: "Internal Error"}).should.equal("500 Internal Error");
    });
});

