#!/usr/bin/env node
'use strict';
const Uploader = require('../lib/uploader');
const FunctionManager = require('../lib/main/function_manager');

new FunctionManager().importFunctions(new Uploader().init());
