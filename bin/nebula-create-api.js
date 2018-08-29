#!/usr/bin/env node
'use strict';
const Uploader = require('../lib/uploader');
const ApiManager = require('../lib/main/api_manager');

new ApiManager().create(new Uploader().init());
