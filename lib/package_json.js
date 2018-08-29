'use strict';

const path = require('path');
const fs = require('fs');

/**
 * package.json リーダ
 */
class PackageJson {
    readPackageJsonFromCwd() {
        this.readPackageJson(path.join(process.cwd(), "package.json"));
    }

    readPackageJson(path) {
        if (fs.existsSync(path)) {
            try {
                // package.json をロードする
                const data = fs.readFileSync(path, "utf8");
                this.parsePackageJson(data);
            } catch (e) {
                console.error("package.json load error: " + e);
                throw e;
            }
        } else {
            console.error("no package.json");
            throw new Error("No package.json");
        }
    }

    parsePackageJson(data) {
        try {
            const pkgJson = JSON.parse(data);
            this.json = pkgJson;
            this.name = pkgJson.name;
            this.version = pkgJson.version;
        } catch (e) {
            console.error("package.json : parse error: " + e);
            throw e;
        }

        if (!this.name || !this.version) {
            console.error("No name or version info");
            throw new Error("No name or version info");
        }
    }
}

module.exports = PackageJson;
