const GetLog = require('../get_log').GetLog;
const ConfigLoader = require('../config_loader');
const config = new ConfigLoader().load();

class GetSystemLog extends GetLog {
    setProgramOptions(){
        super.setProgramOptions();
        this.program.option("-T, --tenant <tenantId>", "tenant ID");
        this.program.option("-A, --app <appId>", "app ID");
    }

    processOptions() {
        const params = super.processOptions();
        let where = {};
        if (params.where) {
            where = JSON.parse(params.where);
        }

        if (this.program.tenant) {
            where.tenantId = this.program.tenant;
        }
        if (this.program.app) {
            where.appId = this.program.app;
        }

        params.where = JSON.stringify(where);
        return params;
    }

    createRequest() {
        // システムキー差し替え
        this.nebula.setAppKey(config.systemKey);

        // リクエスト生成
        return new this.nebula.HttpRequest(this.nebula, "/1/_systemlog", {noprefix: true});
    }
}

module.exports = GetSystemLog;
