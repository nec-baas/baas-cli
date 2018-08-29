#!/usr/bin/env node
'use strict';
const Downloader = require('../lib/downloader');
const ApiManager = require('../lib/main/api_manager');

new ApiManager().list(new Downloader().init());
