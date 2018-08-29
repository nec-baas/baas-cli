/*
 * NEC Mobile Backend Platform
 *
 * Copyright (C) 2014-2018, NEC Corporation
 */
/**
 * Utility
 */
'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const readline = require('readline-sync');

module.exports = class Util {
    static loadFile(path) {
        let content;
        try {
            content = fs.readFileSync(path, "utf8");
        } catch (e) {
            console.error("Can't load file : " + path);
            throw e;
        }
        return content;
    }

    static loadJsonOrYaml(path) {
        const content = this.loadFile(path);
        return Util.parseJsonOrYaml(content, path);
    }

    static parseJsonOrYaml(content, path) {
        let json;
        if (path == null || path.match(/\.yml$/) || path.match(/\.yaml$/)) {
            try {
                json = yaml.safeLoad(content);
            } catch (e) {
                console.error("YAML parse error in " + path);
                throw e;
            }
        } else {
            try {
                json = JSON.parse(content);
            } catch (e) {
                console.error("JSON parse error in " + path);
                throw e;
            }
        }

        return json;
    }

    static jsonToYaml(json) {
        return yaml.safeDump(json);
    }

    static errorText(error) {
        if (error && error.statusText) {
            // nebula error
            return `${error.status} ${error.statusText}`; // `: ${error.responseText}`;
        } else if (error.message) {
            return error.message;
        } else {
            return error;
        }
    }

    /**
     * クエリパラメータ文字列を生成する
     * @param params
     * @returns {string}
     */
    /*
    static createQueryParams(params) {
        let queryParams = "";
        for (let key in params) {
            if (queryParams === "") {
                queryParams = "?";
            } else {
                queryParams += "&";
            }
            queryParams += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
        }
        return queryParams;
    }
    */

    /**
     * commander の不要 option 値を削除する
     * see. https://github.com/tj/commander.js/issues/284
     * @param program
     */
    static cleanCommanderOptions(program) {
        Object.keys(program.opts()).forEach((opt) => {
            if (Object.prototype.toString.call(program[opt]) == '[object Function]') {
                delete program[opt];
            }
        });
    }

    static promptUserYn(message) {
        const answer = readline.question(message);
        if (answer === "y" || answer === "Y") return;

        console.log("abort.");
        process.exit(1);
    }
};

