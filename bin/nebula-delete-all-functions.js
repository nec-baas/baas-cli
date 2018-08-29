#!/usr/bin/env node
'use strict';
const Deleter = require('../lib/deleter');
const FunctionManager = require('../lib/main/function_manager');

new FunctionManager().deleteAll(new Deleter().init());
