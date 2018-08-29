'use strict';

const Nebula = require('@nec-baas/jssdk').Nebula;

class MockOut {
    write(data) {
        this.data = data;
    }
}

class MockProcess {
    constructor(args) {
        this.argv = ["/bin/node", "/dummy.js"];
        if (args != null) {
            this.argv = this.argv.concat(args.split(" "));
        }

        this.stdout = new MockOut();
        this.stderr = new MockOut();
    }

    exit(code) {
        throw "exit " + code;
    }
}

exports.MockProcess = MockProcess;

class MockFs {
    writeFileSync(file, data) {
        this.file = file;
        this.data = data;
    }

    readFileSync(file) {
        this.file = file;
        return "DATA";
    }
}
exports.MockFs = MockFs;

class MockHttpRequest {
    constructor(nebula, path) {
        this.path = path;
        this.headers = {};
    }

    setMethod(method) {
        this.method = method;
    }

    setData(data) {
        this.data = data;
    }

    setContentType(contentType) {
        this.contentType = contentType;
    }

    setRequestHeader(name, value) {
        this.headers[name] = value;
    }

    setQueryParams(params) {
        this.queryParams = params;
    }

    clearResponses() {
        MockHttpRequest.responses = [];
    }

    setResponse(response) {
        MockHttpRequest.responses = [response];
    }

    addResponse(response) {
        MockHttpRequest.responses.push(response);
    }

    execute() {
        return new Promise((resolve, reject) => {
            resolve(MockHttpRequest.responses.shift());
        });
    }
}

exports.MockHttpRequest = MockHttpRequest;

class MockFileBucket {
    constructor(name) {
        this.name = name;
        MockFileBucket.queue.push(this);
    }

    setDescription(desc) {
        this.desc = desc;
    }

    setAcl(acl) {
        this.acl = acl;
    }

    setContentAcl(acl) {
        this.contentAcl = acl;
    }

    static loadBucket(name) {
        return Promise.resolve(new MockFileBucket(name));
    }

    saveBucket() {
        this.saveBucketCalled = true;
        return Promise.resolve(this);
    }

    saveAs(filename, data, metadata) {
        this.filename = filename;
        this.data = data;
        this.metadata = metadata;

        return Promise.resolve({});
    }

    save(filename, data) {
        this.filename = filename;
        this.data = data;

        return Promise.resolve({});
    }

    load(filename) {
        this.filename = filename;

        const buffer = new Buffer("DATA");
        return Promise.resolve(buffer);
    }

    remove(filename) {
        this.filename = filename;

        return Promise.resolve(filename);
    }

    getList() {
        const file1 = new Nebula.FileMetadata();
        file1.setFileName("file1");
        this.files = [file1];

        return Promise.resolve(this.files);
    }
}

MockFileBucket.queue = [];

exports.MockFileBucket = MockFileBucket;

class MockNebula {
    constructor() {
        this.HttpRequest = MockHttpRequest;
        this.FileBucket = MockFileBucket;
        this.Acl = Nebula.Acl;
        this.FileMetadata = Nebula.FileMetadata;
        this.User = Nebula.User;
    }
}

exports.MockNebula = MockNebula;


exports.MockDownloader = class MockDownloader {
    download(req, outfile, opts) {
        this.req = req;
        this.outfile = outfile;
        this.opts = opts;
    }
};

exports.MockUploader= class MockUploader {
    upload(path, data, contentType, headers) {
        this.path = path;
        this.data = data;
        this.contentType = contentType;
        this.headers = headers;
    }
};

exports.MockDeleter = class MockDeleter {
    delete(path) {
        this.path = path;
    }
};




