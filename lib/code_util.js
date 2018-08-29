'use strict';

const fs = require('fs');
const path = require('path');
const PackageJson = require('./package_json');

class CodeUtil {
    constructor() {
        this.pkgJson = new PackageJson();
    }

    setOpts(opts) {
        this.opts = opts;
    }

    resolveCodeFilePath() {
        let name = this.opts.name;
        let version = this.opts.version;
        let filepath = this.opts.file;

        if (!filepath) {
            // package.json から name, version 取り出し
            if (!name || !version) {
                try {
                    this.pkgJson.readPackageJsonFromCwd();
                } catch (e) {
                    process.exit(1);
                }

                name = this.pkgJson.name;
                version = this.pkgJson.version;
            }
            filepath = `${name}-${version}.tgz`;
        }

        return filepath;
    }

    resolveContentType(filename) {
        const extname = path.extname(filename);

        switch (extname) {
            case ".tgz":
                return "application/gzip";

            case ".jar":
                return "application/java-archive";

            default:
                return "application/octet-stream"; // TODO:
        }
    }
}

module.exports = CodeUtil;
