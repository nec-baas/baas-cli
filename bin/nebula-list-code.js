#!/usr/bin/env node
'use strict';
const FileLister = require('../lib/file_lister');
const CodeManager = require('../lib/main/code_manager');

new CodeManager().list(new FileLister().init());
