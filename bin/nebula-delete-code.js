#!/usr/bin/env node
'use strict';
const FileDeleter = require('../lib/file_deleter');
const CodeManager = require('../lib/main/code_manager');

new CodeManager().delete(new FileDeleter().init());
