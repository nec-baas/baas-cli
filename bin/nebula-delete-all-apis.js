#!/usr/bin/env node
'use strict';
const Deleter = require('../lib/deleter');
const ApiManager = require('../lib/main/api_manager');

new ApiManager().deleteAll(new Deleter().init());
