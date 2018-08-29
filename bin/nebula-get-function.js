#!/usr/bin/env node
'use strict';
const Downloader = require('../lib/downloader');
const FunctionManager = require('../lib/main/function_manager');

new FunctionManager().download(new Downloader().init());
