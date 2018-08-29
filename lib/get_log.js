/*
 * NEC Mobile Backend Platform
 *
 * Copyright (C) 2014-2018, NEC Corporation
 */
"use strict";

const Util = require('../lib/util');
const Base = require('./base');

/**
 * ログ取得
 */
class GetLog extends Base {
    /**
     * コンストラクタ
     */
    constructor() {
        super();
        this.program = require('commander');
        this.format = "simple";
    }

    /**
     * ログ取得実行
     */
    exec(process) {
        this.setProgramOptions();
        this.program.parse(process.argv);

        const queryParams = this.processOptions();

        const req = this.createRequest();
        req.setMethod("GET");
        req.setQueryParams(queryParams);

        return req.execute()
            .then((json_text) => {
                const json = JSON.parse(json_text);
                if (this.format == "json") {
                    console.log(JSON.stringify(json, null, " "));
                } else {
                    for (let result of json.results) {
                        console.log(this.formatLog(result));
                    }
                }
            })
            .catch((error) => {
                console.error(Util.errorText(error));
                process.exit(1);
            });
    }

    formatLog(log) {
        switch (this.format) {
        case "simple":
            var time = new Date(log.time).toLocaleString(); // local time に変換
            return `${time} ${log.level} [${log.thread}] ${log.logger} - ${log.log}`;

        default:
            console.error(`Invalid format: ${this.format}`);
            process.exit(1);
        }
    }

    /**
     * コマンドラインオプションの追加処理。
     * 必要に応じてオーバライドすること。
     */
    setProgramOptions() {
        this.program
            .option("-s, --start <date>", "start date/time")
            .option("-e, --end <date>", "end date/time")
            .option("-r, --recent <min>", "show logs in specified minutes")
            .option("-l, --limit <limit>", "limit number of log entries")
            .option("-t, --format <format>", "format (simple, json)")
            .option("-L, --level <level>", "log level (comma separated values of ERROR, WARN, INFO, or DEBUG.)")
            .option("-q, --query <query>", "MongoDB query");
        
    }

    /**
     * コマンドラインオプションの処理してクエリパラメータに変換する
     * @returns {Object} クエリパラメータ
     */
    processOptions() {
        if (this.program.format) {
            this.format = this.program.format;
        }

        let start = this.program.start ? new Date(Date.parse(this.program.start)) : null;
        let end = this.program.end ? new Date(Date.parse(this.program.end)) : null;

        if (!start && this.program.recent) {
            start = new Date(new Date() - (this.program.recent * 60 * 1000));
        }

        let params = {};
        if (start) {
            params.start = new Date(start).toISOString();
        }
        if (end) {
            params.end = new Date(end).toISOString();
        }

        if (this.program.limit) {
            params.limit = this.program.limit;
        }

        let where = {};
        if (this.program.query) {
            where = JSON.parse(this.program.query);
        }
        if (this.program.level) {
            where.level = {"$in": this.program.level.split(",")};
        }
        if (Object.keys(where).length > 0) {
            params.where = JSON.stringify(where);
        }
        return params;
    }

    /**
     * HttpRequest を生成する
     * @return HttpRequest
     */
    createRequest() {
        throw new Error("You must override createRequest()!")
    }
}

exports.GetLog = GetLog;
