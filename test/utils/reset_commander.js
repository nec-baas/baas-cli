// Commander をリセットする

'use strict';

module.exports = function() {
    // require キャッシュから削除
    for (const key in require.cache) {
        if (key.indexOf("commander") >= 0) {
            delete require.cache[key];
        }
    }
};
