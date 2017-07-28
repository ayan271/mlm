var jm = jm || {};
if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    jm = require('jm-sdk-core');
    require('jm-ms');
}

(function () {
    var sdk = jm.sdk;
    var storage = sdk.storage;
    var ms = jm.ms;

    var modelName = 'config';
    if(sdk[modelName]) return;
    sdk.on('init', function (opts) {
        opts[modelName] = opts[modelName] || {};
        opts[modelName].uri = opts[modelName].uri || opts.uri;
        opts[modelName].timeout = opts[modelName].timeout || opts.timeout;
        sdk[modelName].init(opts[modelName]);
    });
    var cb_default = function(err, doc) {};

    /**
     * config对象
     * @class  config
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  uri: 服务器uri(可选)
     * }
     */
    sdk.config = {
        init: function (opts) {
            var self = this;
            jm.enableEvent(this);
            opts = opts || {};
            var uri = opts.uri;
            var prefix = opts.prefix || '/' + modelName;
            this.uri = uri + prefix;
            var app = ms();
            self.client = app;
            app.use(function(opts, cb, next){
                opts.data || (opts.data={});
                if(!opts.data.token){
                    var token = storage.getItem('token') || null;
                    if(token) opts.data.token = token;
                }
                next();
            });
            ms.client({
                uri: this.uri,
                timeout: opts.timeout || 0
            }, function(err, doc){
                if(!err && doc) {
                    app.use(doc);
                    doc.on('open', function(){
                        self.emit('open');
                        sdk.emit('open', modelName);
                    });
                    doc.on('close', function(){
                        self.emit('close');
                        sdk.emit('close', modelName);
                    });
                }
            });
        },

        _getlisturi: function(opts){
            var root = opts.root || '';
            return '/' + root;
        },

        _geturi: function(opts){
            var key = opts.key || '';
            return this._getlisturi(opts) + '/' + key;
        },

        /**
         * 获取配置信息
         * @function config#getConfig
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  root: 根(必填)
         *  key: 配置项(必填)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * doc参数:{
         *  ret: 配置值(基本类型, 对象或者数组)
         *  }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        getConfig: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            opts = opts || {};
            var url = this._geturi(opts);
            this.client.get({
                uri: url
            }, cb);
        },

        /**
         * 设置配置信息
         * @function config#setConfig
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  root: 根(必填)
         *  key: 配置项(必填)
         *  value: 配置值(可选)
         *  expire: 过期时间(可选, 单位秒, 默认0代表永不过期)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * doc参数:{
         *  ret: 结果(true or false)
         *  }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        setConfig: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            opts = opts || {};
            var url = this._geturi(opts);
            this.client.post({
                uri: url,
                data: opts
            }, cb);
        },

        /**
         * 删除配置信息
         * @function config#delConfig
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  root: 根(必填)
         *  key: 配置项(必填)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * doc参数:{
         *  ret: 结果(true or false)
         *  }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        delConfig: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            opts = opts || {};
            var url = this._geturi(opts);
            this.client.delete({
                uri: url
            }, cb);
        },

        /**
         * 删除根配置, 所有根下面的配置信息都被删除
         * @function config#delRoot
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  root: 根(必填)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * doc参数:{
         *  ret: 结果(true or false)
         *  }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        delRoot: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            opts = opts || {};
            var url = this._getlisturi(opts);
            this.client.delete({
                uri: url
            }, cb);
        },

        /**
         * 列出配置项
         * @function config#listConfig
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  root: 根(必填)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * doc参数: {
         *  rows: 配置项数组
         *  }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        listConfig: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            opts = opts || {};
            var url = this._getlisturi(opts);
            this.client.get({
                uri: url,
                data:opts
            }, cb);
        },

        /**
         * 设置多个配置信息
         * @function config#setConfigs
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  root: 根(必填)
         *  value: 配置对象(可选, 默认{})
         *  expire: 过期时间(可选, 单位秒, 默认0代表永不过期)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * doc参数:{
         *  ret: 结果(true or false)
         *  }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        setConfigs: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            opts = opts || {};
            var url = this._geturi(opts);
            this.client.post({
                uri: url,
                data: opts
            }, cb);
        }
    };

})();
