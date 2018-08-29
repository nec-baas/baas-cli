/*
 * NEC Mobile Backend Platform
 *
 * COPYRIGHT (C) 2014-2016 NEC CORPORATION
 */
/**
 * アップローダ
 */
'use strict';

const Util = require('./util');
const Base = require('./base');

class FileUploader extends Base {
    upload(bucketname, filename, data, contentType, createFlag) {
        const bucket = new this.nebula.FileBucket(bucketname);

        bucket.setDescription("Custom code");
        bucket.setAcl(new this.nebula.Acl());
        bucket.setContentAcl(new this.nebula.Acl());

        return this.nebula.FileBucket.loadBucket(bucketname)
            .catch((err) => {
                // バケット存在しない。作成する。
                console.log("Create bucket");
                return bucket.saveBucket();
            })
            .then(() => {

                if (createFlag) {
                    // ファイルアップロード
                    const metadata = new this.nebula.FileMetadata();
                    metadata.setFileName(filename);
                    metadata.setContentType(contentType);
                    metadata.setAcl(new this.nebula.Acl());

                    return bucket.saveAs(filename, data, metadata);
                } else {
                    // ファイル更新
                    return bucket.save(filename, data);
                }
            })
            .then(function (_metadata) {
                //console.log(JSON.stringify(response)); // TODO:
                console.log("Successfully uploaded.");
            })
            .catch(function (error) {
                console.error(Util.errorText(error));
                process.exit(1);
            });
    }
}

module.exports = FileUploader;
