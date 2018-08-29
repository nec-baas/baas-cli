#!/usr/bin/env node
'use strict';

const GetSystemLog = require('../lib/main/get-system-log');

const log = new GetSystemLog();
log.init();
log.exec(process);

