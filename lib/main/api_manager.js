/*
 * NEC Mobile Backend Platform
 *
 * Copyright (C) 2014-2018, NEC Corporation
 */
/**
 * API管理
 */
'use strict';

let program;
const Util = require('../util');
const BaseManager = require('./base_manager');

class ApiManager extends BaseManager {
    constructor() {
        super();
        program = require('commander');
    }

    // for mock
    loadFile(path) {
        return Util.loadFile(path);
    }

    create(uploader) {
        program
            .parse(this.process.argv);
        //    .option("-n, --apiname <api-name>", "API name (base path)")
        //Util.cleanCommanderOptions(program);

        //let apiname = program["apiname"] || null;
        let apiname = null;

        const path = program.args[0];
        if (!path) {
            console.error("No file specified.");
            this.exit(1);
        }

        const apiText = this.loadFile(path);
        const apiJson = Util.parseJsonOrYaml(apiText, path);

        //console.log(JSON.stringify(json));

        // basePath から apiname を取り出す
        if (!apiname) {
            if (apiJson.basePath) {
                const re = /\/([^/]+)\/?$/;
                const ary = re.exec(apiJson.basePath);
                if (ary) {
                    apiname = ary[1];
                }
            }
        }
        if (!apiname) {
            console.error("No api-name");
            this.exit(1);
        }

        // v6.2: JSONではなくテキスト(JSON/YAML)でアップロードする
        uploader.upload(`/apigw/apis/${apiname}`, apiText, "text/plain");
    }

    createMulti(uploader) {
        program
            .parse(this.process.argv);

        const path = program.args[0];
        if (!path) {
            console.error("No file specified.");
            this.exit(1);
        }

        const apiJson = Util.parseJsonOrYaml(this.loadFile(path), path);

        uploader.upload("/apigw/apis/", apiJson, "application/json");
    }

    list(downloader) {
        program
            .option("-o, --out <filename>", "output file name")
            .option("-y, --yaml", "output YAML format")
            .parse(this.process.argv);

        const outfile = program.out;

        downloader.download("/apigw/apis", outfile, {format_json: true, yaml: program.yaml});
    }

    get(downloader) {
        program
            .option("-o, --out <filename>", "output file name")
            .option("-j, --json", "convert to JSON format")
            .option("-y, --yaml", "convert to YAML format")
            .parse(this.process.argv);

        const name = program.args[0];
        if (!name) {
            console.error("No name");
            this.exit(1);
        }
        const outfile = program.out;

        const isText = !program.json && !program.yaml;
        const opts = {
            format_json: !isText,
            yaml: !isText && program.yaml
        };
        const queryParams = {};
        if (isText) {
            queryParams.format = "text";
        }

        downloader.download(`/apigw/apis/${name}`, outfile, opts, queryParams);
    }


    delete(deleter) {
        program
            .parse(this.process.argv);

        const name = program.args[0];
        if (!name) {
            console.error("No name");
            this.exit(1);
        }

        deleter.delete(`/apigw/apis/${name}`);
    }

    deleteAll(deleter) {
        program
            .option("    --noconfirm", "No confirmation before execute")
            .parse(this.process.argv);

        if (!program.noconfirm) {
            Util.promptUserYn("*** WARNING **\nThis will delete ALL APIs on the server.\nAre you sure? (y/n)");
        }

        deleter.delete("/apigw/apis/");
    }
}

module.exports = ApiManager;
