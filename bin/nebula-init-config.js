#!/usr/bin/env node
/*
 * NEC Mobile Backend Platform
 *
 * COPYRIGHT (C) 2014-2018 NEC CORPORATION
 */
'use strict';

const fs = require('fs');
const path = require('path');

const configFile = path.join(process.cwd(), "nebula_config.yaml");

if (fs.existsSync(configFile)) {
    console.error("Config file already exists: " + configFile);
    process.exit(1);
}

const template = 
`tenant: TENANT_ID
appId: APP_ID
masterKey: APP_KEY
systemKey: SYSTEM_KEY
baseUri: https://nebula.example.com/api
debugMode: release
proxy:
  host: null
  port: 0
`;

fs.writeFileSync(configFile, template, "utf8");
console.log("Config file created : " + configFile);

