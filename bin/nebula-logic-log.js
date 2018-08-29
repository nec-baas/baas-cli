#!/usr/bin/env node
'use strict';

const GetCustomLog = require('../lib/main/get-logic-log');

const log = new GetCustomLog();
log.init();
log.exec(process);

