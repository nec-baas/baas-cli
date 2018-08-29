#!/usr/bin/env node
'use strict';
const FileUploader = require('../lib/file_uploader');
const CodeManager = require('../lib/main/code_manager');

new CodeManager().createUpdate(new FileUploader().init(), true);

