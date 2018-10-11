/*
 * NEC Mobile Backend Platform
 *
 * COPYRIGHT (C) 2014-2018 NEC CORPORATION
 */
/**
 * 設定ファイルローダ
 */
'use strict';

const fs = require('fs');
const path = require('path');
const Util = require('./util');

class ConfigLoader {
    constructor() {
        this.injectedConfig = null;
    }

    /**
     * 指定ディレクトリから JSON/YAML 設定を読み込む
     * @param dir ディレクトリ
     * @param filenames ファイル名の配列
     * @returns 設定情報。ファイルが存在しない場合は null, フォーマットエラー時は例外。
     */
    loadConfig(dir, filenames) {
        for (const filename of filenames) {
            const configPath = path.join(dir, filename);

            if (fs.existsSync(configPath)) {
                return Util.loadJsonOrYaml(configPath);
            }
        }
        return null; // no file
    };

    /**
     * 設定ファイルをロードする。
     * @param dir 設定ファイルのディレクトリ。指定なしの場合はカレントディレクトリ、ホームディレクトリの順に探す。
     * @param filename ファイル名。指定なしの場合は "nebula_config.json"。
     * @returns {設定情報}
     */
    load(dir, filename) {
        // テスト用
        if (this.injectedConfig) {
            return this.injectedConfig;
        }

        let filenames;
        if (!filename) {
            filenames = ["nebula_config.yaml", "nebula_config.json"];
        } else {
            filenames = [filename];
        }

        try {
            let config = this.loadConfig(dir ? dir : process.cwd(), filenames);
            if (config) return config;

            if (!dir) {
                // ディレクトリ指定がない場合はホームディレクトリも探す
                let home = process.env["HOME"];
                if (home == undefined) {
                    // Windows
                    home = process.env["USERPROFILE"];
                }
                if (home) {
                    config = this.loadConfig(home, filenames);
                    if (config) return config;
                }
            }

            console.error(`Can't load config file`);
            this.exit(1);
        } catch (err) {
            console.error(err.message);
            this.exit(1);
        }
    }

    /**
     * テスト用: 設定ファイルを inject する
     * @param config
     * @private
     */
    _injectConfig(config) {
        this.injectedConfig = config;
    }

    exit(code) {
        process.exit(code);
    }
}

module.exports = ConfigLoader;


