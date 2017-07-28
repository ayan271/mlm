var jm = jm || {};
if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    jm = require('jm-sdk-core');
    require('jm-ms');
}

(function () {
    var sdk = jm.sdk;
    var storage = sdk.storage;
    var ms = jm.ms;

    var modelName = 'acl';
    if(sdk[modelName]) return;
    sdk.on('init', function (opts) {
        opts[modelName] = opts[modelName] || {};
        opts[modelName].uri = opts[modelName].uri || opts.uri;
        opts[modelName].timeout = opts[modelName].timeout || opts.timeout;
        sdk[modelName].init(opts[modelName]);
    });
    var cb_default = function(err, doc) {};

    /**
     * acl对象
     * @class  acl
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  uri: 服务器uri(可选)
     * }
     */
    sdk.acl = {
        init: function (opts) {
            var self = this;
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
                    app.use({fn: doc});
                    doc.on('open', function(){
                        sdk.emit('open', modelName);
                    });
                    doc.on('close', function(){
                        sdk.emit('close', modelName);
                    });
                }
            });
            jm.enableEvent(this);
        },

        /**
         * 检测是否有权限访问
         * @function acl#isAllowed
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  token: (可选)
         *  user: 用户(可选)
         *  resource: 资源(可选)
         *  permisssions: 权限(可选)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * doc参数:{
         *  ret: 结果 1允许 0禁止
         *  }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        isAllowed: function (opts, cb) {
            cb || (cb = cb_default);
            opts || (opts = {});
            var url = '/isAllowed';
            this.client.get({
                uri: url,
                data: opts
            }, cb);
        },

        /**
         * 获取用户角色
         * @function acl#userRoles
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  token: (可选)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * doc参数:{
         *  ret: 角色数组
         *  }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        userRoles: function (opts, cb) {
            cb || (cb = cb_default);
            opts || (opts = {});
            var url = '/userRoles';
            this.client.get({
                uri: url,
                data: opts
            }, cb);
        },
        /**
         * 获取用户资源及权限
         * @function acl#userResources
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  user: 用户id(必填)
         *  resource: 资源(可选)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * {
         *  '资源':['权限']
         * }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        userResources:function (opts,cb) {
            cb || (cb = cb_default);
            opts || (opts = {});
            var url = '/userResources';
            this.client.get({
                uri: url,
                data: opts
            }, cb);
        },
        /**
         * 重新加载
         * @function acl#reload
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  token: (可选)
         *  name:(可选)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * doc参数:{
         *  ret: 1
         *  }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        reload:function (opts,cb) {
            cb || (cb = cb_default);
            opts || (opts = {});
            var url = '/reload';
            this.client.get({
                uri: url,
                data: opts
            }, cb);
        },
        /**
         * 获取角色资源
         * @function acl#roleResources
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  token: (可选)
         *  roles:
         *  permissions:(可选)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * 方式一:
         * {
         *  '资源':['权限']
         * }
         * 方式二:
         * {
         *  rows:['具有指定权限的资源']
         * }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        roleResources:function (opts,cb) {
            cb || (cb = cb_default);
            opts || (opts = {});
            var url = '/roleResources';
            this.client.get({
                uri: url,
                data: opts
            }, cb);
        },

        /**
         * 添加用户角色
         * @function acl#addUserRoles
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  user: 用户id(必填)
         *  role: 角色(必填)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * doc参数:{
         *  ret: 1
         *  }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        addUserRoles:function (opts,cb) {
            cb || (cb = cb_default);
            opts || (opts = {});
            var url = '/userRoles';
            this.client.put({
                uri: url,
                data: opts
            }, cb);
        },

        /**
         * 移除用户角色
         * @function acl#removeUserRoles
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  user: 用户id(必填)
         *  role: 角色(必填)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * doc参数:{
         *  ret: 1
         *  }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        removeUserRoles:function (opts,cb) {
            cb || (cb = cb_default);
            opts || (opts = {});
            var url = '/userRoles';
            this.client.delete({
                uri: url,
                data: opts
            }, cb);
        }

    };

    var acl = sdk.acl;
    acl.role = {
        /**
         * 填充角色
         * @function acl#role.init
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  rows:[{code: '角色编码', title: '标题', description:'描述',parents:['父编码'], allows: [{resource:'资源编码', permissions: ['权限']}]}]
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * {
         *  ret:true|false
         * }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        init: function(opts, cb) {
            cb || (cb = cb_default);
            opts || (opts = {});
            var url = '/roles/init';
            acl.client.post({
                uri: url,
                data: opts
            }, cb);
        },
        list: function(opts, cb) {
            cb || (cb = cb_default);
            opts || (opts = {});
            var url = '/roles';
            acl.client.get({
                uri: url,
                data: opts
            }, cb);
        }
    };

    acl.user = {
        list: function(opts, cb) {
            cb || (cb = cb_default);
            opts || (opts = {});
            var url = '/users';
            acl.client.get({
                uri: url,
                data: opts
            }, cb);
        }
    };
    acl.resource = {
        /**
         * 填充资源
         * @function acl#resource.init
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  rows:[{code: '资源编码', title: '标题', permissions: ['权限'],children: []}]
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * {
         *  ret:true|false
         * }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        init: function(opts, cb) {
            cb || (cb = cb_default);
            opts || (opts = {});
            var url = '/resources/init';
            acl.client.post({
                uri: url,
                data: opts
            }, cb);
        },
        list: function(opts, cb) {
            cb || (cb = cb_default);
            opts || (opts = {});
            var url = '/resources';
            acl.client.get({
                uri: url,
                data: opts
            }, cb);
        },
        all: function(opts, cb) {
            cb || (cb = cb_default);
            opts || (opts = {});
            var url = '/resources/all';
            acl.client.get({
                uri: url,
                data: opts
            }, cb);
        },
        tree: function(opts, cb) {
            cb || (cb = cb_default);
            opts || (opts = {});
            var url = '/resources/tree';
            acl.client.get({
                uri: url,
                data: opts
            }, cb);
        }
    };

})();
