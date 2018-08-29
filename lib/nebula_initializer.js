/*
 * NEC Mobile Backend Platform
 *
 * Copyright (C) 2014-2018, NEC Corporation
 */
/**
 * Nebula イニシャライザ
 */
'use strict';

const Nebula = require('@nec-baas/jssdk').Nebula;
const ConfigLoader = require('./config_loader');

/**
 * Nebula 初期化
 * @returns {NebulaService} NebulaService
 */
exports.init = function(config) {
    if (!config) {
        config = new ConfigLoader().load();
    }

    config.appKey = config.masterKey;
    config.offline = false;

    if (config.proxy && config.proxy.host) {
        if (config.baseUri.startsWith("http:")) {
            Nebula.setHttpProxy(config.proxy);
        } else {
            Nebula.setHttpsProxy(config.proxy);
        }
    }

    // Nebula 初期化
    const service = new Nebula.NebulaService();
    service.initialize(config);

    return service;
};


