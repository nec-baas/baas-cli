#!/usr/bin/env node
/*
 * NEC Mobile Backend Platform
 *
 * COPYRIGHT (C) 2014-2017 NEC CORPORATION
 */
'use strict';

const program = require('commander');

program
    .version("7.0.0")
    .command("init-config", "initialize config file")

    .command("create-code", "upload code")
    .command("update-code", "update code")
    .command("list-code", "list code")
    .command("get-code <filename>", "download code")
    .command("delete-code <filename>", "delete code")

    .command("create-apis <file>", "create apis")
    .command("create-api <file>", "create api")
    .command("list-apis", "list apis")
    .command("get-api <name>", "get api")
    .command("delete-api <name>", "delete api")
    .command("delete-all-apis", "delete ALL apis")

    .command("create-function <function-file>", "create function")
    .command("export-functions", "export all functions to function table")
    .command("import-functions <function-table-file>", "import all functions from function table")
    .command("get-function <function-name>", "get function")
    .command("delete-function <function-name>", "delete function")
    .command("delete-all-functions", "delete ALL functions")

    .command("logic-log", "get custom logic log")
    .command("system-log", "get system log")

    .command("create-user", "create user")
    .command("query-users", "query users")
    .command("delete-user", "delete user");

program.parse(process.argv);

// check unknown command: https://github.com/tj/commander.js/issues/432
const _ = require('lodash');
const subCmd = _.head(program.args);
const cmds = _.map(program.commands, "_name");

if (!_.includes(cmds, subCmd)) {
    console.error("Unknown command: " + subCmd);
    program.help();
}

