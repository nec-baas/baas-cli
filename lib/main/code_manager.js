/*
 * NEC Mobile Backend Platform
 *
 * Copyright (C) 2014-2018, NEC Corporation
 */

'use strict';

const path = require('path');
const Util = require('../util');
const CodeUtil = require('../code_util');
const BaseManager = require('./base_manager');

let program;

class CodeManager extends BaseManager {
    constructor() {
        super();
        program = require('commander');

        this.fs = require('fs');
        this.codeUtil = new CodeUtil();
    }

    createUpdate(file_uploader, isNew) {
        program
            .option("-b, --bucket <bucket>", "bucket name (default: CUSTOM_CODE)")
            .option("-f, --file <filename>", "code file")
            .parse(this.process.argv);

        Util.cleanCommanderOptions(program);

        // オプション引数取り出し
        const opts = program.opts();
        const bucketname = opts.bucket || "CUSTOM_CODE";

        this.codeUtil.setOpts(opts);

        const filepath = this.codeUtil.resolveCodeFilePath();
        const filename = path.basename(filepath);
        const contentType = this.codeUtil.resolveContentType(filename);

        // ファイル読み込み
        let body;
        try {
            body = this.fs.readFileSync(filepath);
        } catch (e) {
            console.error(`File load error: ${filepath}, ` + e);
            this.exit(1);
        }

        // アップロード
        file_uploader.upload(bucketname, filename, body, contentType, isNew);
    }

    download(file_downloader) {
        program
            .option("-b, --bucket <bucket>", "bucket name (default: CUSTOM_CODE)")
            .option("-o, --out <filename>", "output file name")
            .parse(this.process.argv);

        const filename = program.args[0];
        const bucketname = program.bucket || "CUSTOM_CODE";
        const outfile = program.out;

        if (!filename) {
            console.error("No filename");
            this.exit(1);
        }

        file_downloader.download(bucketname, filename, outfile);
    }

    list(file_lister) {
        program
            .option("-b, --bucket <bucket>", "bucket name (default: CUSTOM_CODE)")
            .parse(this.process.argv);

        const bucketname = program.bucket || "CUSTOM_CODE";

        file_lister.list(bucketname);
    }

    delete(file_deleter) {
        program
            .option("-b, --bucket <bucket>", "bucket name (default: CUSTOM_CODE)")
            .parse(this.process.argv);

        const filename = program.args[0];
        const bucketname = program.bucket || "CUSTOM_CODE";

        if (!filename) {
            console.error("No filename");
            this.exit(1);
        }

        file_deleter.delete(bucketname, filename);
    }
}

module.exports = CodeManager;
