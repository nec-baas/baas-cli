/*
 * NEC Mobile Backend Platform
 *
 * COPYRIGHT (C) 2014-2016 NEC CORPORATION
 */
/**
 * ファンクション管理
 */
'use strict';

const Util = require('../util');
const BaseManager = require('./base_manager');

let program;

class FunctionManager extends BaseManager {
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

        const path = program.args[0];
        if (!path) {
            console.error("No file specified");
            this.exit(1);
        }

        const json = Util.parseJsonOrYaml(this.loadFile(path), path);

        const keys = Object.keys(json);
        if (keys.length == 0) {
            console.error("No function.");
            this.exit(1);
        } else if (keys.length > 1) {
            console.error("Function file can contain only one function.");
            this.exit(1);
        }
        const functionName = keys[0];
        const functionJson = json[functionName];

        uploader.upload("/functions/" + functionName, functionJson, "application/json");
    }

    importFunctions(uploader) {
        program
            .option("    --noconfirm", "No confirmation before execute")
            .parse(this.process.argv);

        const path = program.args[0];
        if (!path) {
            console.error("No file specified");
            this.exit(1);
        }

        const functionTableJson = Util.parseJsonOrYaml(this.loadFile(path), path);

        if (!program.noconfirm) {
            Util.promptUserYn("*** WARNING **\nThis will delete ALL functions on the server before import.\nAre you sure? (y/n)");
        }

        uploader.upload("/functions", functionTableJson, "application/json");
    }

    download(downloader) {
        program
            .option("-o, --out <filename>", "output file name")
            .option("-y, --yaml", "output YAML format")
            .parse(this.process.argv);

        const functionName = program.args[0];
        if (!functionName) {
            console.error("No function name");
            this.exit(1);
        }
        const outfile = program.out;

        downloader.download("/functions/" + functionName, outfile, {
            filter: (data) => {
                const functionDef = JSON.parse(data);
                let json = {};
                json[functionName] = functionDef;

                if (program.yaml) {
                    return Util.jsonToYaml(json);
                } else {
                    return JSON.stringify(json, null, "  ");
                }
            }
        });
    }

    exportFunctions(downloader) {
        program
            .option("-o, --out <filename>", "output file name")
            .option("-y, --yaml", "output YAML format")
            .parse(this.process.argv);

        const outfile = program.out;

        downloader.download("/functions", outfile, {format_json: true, yaml: program.yaml});
    }

    delete(deleter) {
        program
            .parse(this.process.argv);

        const functionName = program.args[0];
        if (!functionName) {
            console.error("No function name");
            this.exit(1);
        }

        deleter.delete("/functions/" + functionName);
    }

    deleteAll(deleter) {
        program
            .option("    --noconfirm", "No confirmation before execute")
            .parse(this.process.argv);

        if (!program.noconfirm) {
            Util.promptUserYn("*** WARNING **\nThis will delete ALL functions on the server.\nAre you sure? (y/n)");
        }

        deleter.delete("/functions/");
    }
}

module.exports = FunctionManager;
