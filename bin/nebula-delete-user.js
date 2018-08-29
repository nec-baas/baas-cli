#!/usr/bin/env node
'use strict';
const Nebula = require('../lib/nebula_initializer').init();
const UserManager = require('../lib/main/user_manager');

new UserManager().setNebula(Nebula).delete();

