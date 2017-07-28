var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

/**
 * sdk对象
 * @class  sdk
 */
(function(){
    if(jm.sdk) return;
    jm.sdk = {};
    var sdk = jm.sdk;
    jm.enableEvent(sdk);
    sdk.getLogger = jm.getLogger;
    sdk.logger = sdk.getLogger();

    /**
     * sdk对象
     * @function sdk#init
     * @param {Object} opts 配置
     */
    sdk.init = function(opts){
        opts = opts || {};
        sdk.emit('init', opts);
    };
})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

(function(){
    if(jm.sdk.consts) return;
    var sdk = jm.sdk;

    sdk.consts = {
        ERR: jm.ERR
    };

})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

(function(){
    if(jm.sdk.utils) return;
    var sdk = jm.sdk;

    /**
     * utils对象
     * @class  utils
     */
    sdk.utils = {

        formatJSON: function(o) {
            return JSON.stringify(o, null, 2);
        }

    };
})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-ajax');
}

(function(){
    if(jm.sdk.$) return;
    var sdk = jm.sdk;
    sdk.$ = {};
    var $ = sdk.$;
    var ERR = sdk.consts.ERR;
    $.ajax = jm.ajax;

    if(!$.get){
        // alias methods
        ['get','post','put','delete','patch'].forEach(function(method) {
            $[method] = function(o) {
                o.type = method;
                $.ajax(o);
            };
        });
    }

    /**
     * 为obj对象增加快捷ajax接口
     * @function sdk#enableAjax
     * @param {Object} obj 对象
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
         *  ignoreDocErr: 是否忽略返回的doc中的err(可选, 默认false, 不忽略, 检测doc.err不为空时, 生成Error)
         * }
     */
    sdk.enableAjax = jm.enableAjax;

})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

(function(){
    if(jm.sdk.storage) return;
    var sdk = jm.sdk;
    var isNode = false;
    var stores = {};
    if (typeof module !== 'undefined' && module.exports) {
        isNode = true;
    }

    sdk.storage = {
        setItem: function(k, v) {
            if(isNode){
                stores[k] = v;
            }else{
                localStorage.setItem(k,v);
            }
        },

        getItem: function(k) {
            if(isNode){
                return stores[k];
            }else{
                return localStorage.getItem(k);
            }
        },

        removeItem: function(k) {
            if(isNode){
                delete stores[k];
            }else{
                localStorage.removeItem(k);
            }
        }
    };

})();
