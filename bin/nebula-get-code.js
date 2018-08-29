#!/usr/bin/env node
'use strict';
const FileDownloader = require('../lib/file_downloader');
const CodeManager = require('../lib/main/code_manager');

new CodeManager().download(new FileDownloader().init());
