var jm = jm || {};
if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    jm = require('jm-sdk-core');
}

(function () {
    var sdk = jm.sdk;
    var $ = sdk.$;
    var storage = sdk.storage;
    var ERR = sdk.consts.ERR;

    sdk.on('init', function (opts) {
        var model = 'sso';
        opts[model] = opts[model] || {};
        opts[model].uri = opts[model].uri || opts.uri;
        opts[model].timeout = opts[model].timeout || opts.timeout;
        sdk[model].init(opts[model]);
    });

    /**
     * sso对象
     * @class  sso
     * @param {Object} opts 配置属性
     * 格式:{uri:'网络地址'}
     */
    sdk.sso = {
        init: function (opts) {
            opts = opts || {};
            var uri = opts.uri;
            var prefix = opts.prefix || '/sso';
            this.uri = uri + prefix;
            jm.enableEvent(this);
            sdk.enableAjax(this,{timeout: opts.timeout || 0});
        },

        /**
         * 注册用户
         * @function sso#signup
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  account: 账号(可选),
         *  mobile: 手机号(可选),
         *  email: 邮箱(可选),
         *  passwd: 密码(必填),
         *  nick: 昵称(可选),
         *  gender: 性别(可选),
         *  country: 国家(可选),
         *  province: 省份(可选),
         *  city: 城市(可选),
         *  area: 地区(可选),
         *  birthday: 生日(可选),
         *  signature: 签名(可选),
         *  headimgurl: 头像(可选)
         * }
         * @param {callback} [cb=function(err, doc){}] 回调
         * @example
         * cb参数格式:
         * 成功时, doc参数:{
         *   id: 用户ObjectId,
         *   uid: 用户id,
         *   nick: 昵称,
         *   gender: 性别,
         *   province: 省份,
         *   city: 城市,
         *   headimgurl: 头像地址,
         *   signature: 签名
         * }
         * 失败时, doc参数:{
         *    'err': '错误码',
         *    'msg': '错误信息'
         * }
         */
        signup: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            this.post({
                url: this.uri + '/signup',
                data: opts
            }, function (err, doc) {
                if(!err && doc && doc.id){
                }else{
                    err = new Error('注册失败');
                }
                if(!err){
                    self.signon(opts, cb);
                } else {
                    cb(err, doc);
                }
                self.emit('signup', err, doc);
            });
        },

        /**
         * 登录
         * @function sso#signon
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  id: id(可选),
         *  account: 账号(可选),
         *  mobile: 手机号(可选),
         *  email: 邮箱(可选),
         *  passwd: 密码(必填),
         * }
         * @param {callback} [cb=function(err, doc){}] 回调
         * @example
         * cb参数格式:
         * 成功时, doc参数:{
         *   id: 用户ObjectId,
         *   uid: 用户id,
         *   nick: 昵称,
         *   gender: 性别,
         *   province: 省份,
         *   city: 城市,
         *   headimgurl: 头像地址,
         *   signature: 签名
         * }
         * 失败时, doc参数:{
         *    'err': '错误码',
         *    'msg': '错误信息'
         * }
         */
        signon: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            this.post({
                    url: this.uri + '/signon',
                    data: opts
                }
                , function (err, doc) {
                    if(!err && doc && doc.id){
                        storage.setItem('token', doc.token);
                        storage.setItem('id', doc.id);
                    }else{
                        storage.removeItem('token');
                        storage.removeItem('id');
                        err = new Error('登录失败');
                    }
                    if(!err){
                        self.getUser(opts, cb);
                    }else{
                        cb(err, doc);
                    }
                    self.emit('signon', err, doc);
                });
        },

        /**
         * 游客登录
         * @function sso#signon_guest
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:{
         *  id: '账号id',
         *  token: '令牌',
         *  account: '账号',
         *  passwd: '密码'
         * }
         * err参数:{
         *    'err': '错误码',
         *    'msg': '错误信息'
         * }
         */
        signon_guest: function (opts, cb) {
            var self = this;
            this.post({
                    url: this.uri + '/signon_guest',
                    data: opts
                },
                function (err, doc) {
                    if(!err && doc && doc.id){
                        storage.setItem('token', doc.token);
                        storage.setItem('id', doc.id);
                    }else{
                        storage.removeItem('token');
                        storage.removeItem('id');
                        err = new Error('登录失败');
                    }
                    cb(err, doc);
                    self.emit('signon', err, doc);
                }
            );
        },

        /**
         * 获取头像网址
         * @param opts 用户
         * @returns {*}
         */
        getAvatarUri: function (opts) {
            var user = opts || self.user;
            if (user) {
                return user.headimgurl || '/upload/sso/' + user.id + '/images/avatar.jpg';
            }
            return '/images/avatar.png';
        },

        /**
         * 获取用户信息
         * @function sso#getUser
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         * }
         * @param {callback} [cb=function(err, doc){}] 回调
         * @example
         * cb参数格式:
         * 成功时,doc参数:{
         *   id: 用户ObjectId,
         *   uid: 用户id,
         *   nick: 昵称,
         *   gender: 性别,
         *   province: 省份,
         *   city: 城市,
         *   headimgurl: 头像地址,
         *   signature: 签名
         * }
         * 失败时,doc参数:{
         *    'err': '错误码',
         *    'msg': '错误信息'
         * }
         */
        getUser: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            opts = opts || {};
            var token = opts.token || storage.getItem('token');
            if (!token) return cb(new Error('获取用户信息失败'), ERR.FA_NOAUTH);
            this.get({
                    url: this.uri + '/user',
                    data: {token: token}
                },
                function (err, doc) {
                    if(!err && doc && doc.id){
                        self.user = {
                            token: token
                        };
                        for (var key in doc) {
                            self.user[key] = doc[key];
                        }
                        self.user.nick || (self.user.nick = '');
                        doc = self.user;
                    }else{
                        storage.removeItem('token');
                        storage.removeItem('id');
                        err = new Error('获取用户信息失败');
                    }
                    cb(err, doc);
                    self.emit('getUser', err, doc);
                }
            );
        },

        /**
         * 退出登录
         * @function sso#signout
         * @param {callback} [cb=function(err,result){}] 回调
         */
        signout: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            opts = opts || {};
            var token = opts.token || storage.getItem('token');
            if (token){
                this.get({
                        url: this.uri + '/signout',
                        data: {token: token}
                    },
                    function (err, doc) {
                    }
                );
            }
            storage.removeItem('token');
            storage.removeItem('id');
            self.user = {};
            cb();
            self.emit('signout');
        },

        /**
         * 更新密码
         * @function sso#updatePasswd
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  token: token(可选, 如果不填,自动从localStorage获取),
         *  newPasswd:'新密码(必填)',
         *  passwd:'旧密码(必填)'
         * }
         * @param {callback} [cb=function(err, doc){}] 回调
         * @example
         * cb参数格式:
         * 成功, doc参数:{
         * }
         * 失败, doc参数:{
         *    'err': '错误码',
         *    'msg': '错误信息'
         * }
         */
        updatePasswd: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            opts = opts || {};
            var token = opts.token || storage.getItem('token');
            if (!token) return cb(new Error('修改密码失败'), ERR.FA_NOAUTH);
            opts.token = token;
            this.post(
                {
                    url: this.uri + '/user/passwd',
                    data: opts
                },
                cb
            );
        },

        /**
         * 更新用户信息
         * @function sso#updateUser
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  token: token(可选, 如果不填,自动从localStorage获取),
         *  account: 账号(可选),
         *  mobile: 手机号(可选),
         *  email: 邮箱(可选),
         *  nick: 昵称(可选),
         *  gender: 性别(可选),
         *  country: 国家(可选),
         *  province: 省份(可选),
         *  city: 城市(可选),
         *  area: 地区(可选),
         *  birthday: 生日(可选),
         *  signature: 签名(可选),
         *  headimgurl: 头像(可选)
         * }
         * @param {callback} [cb=function(err, doc){}] 回调
         * @example
         * cb参数格式:
         * 成功, doc参数:{
         * }
         * 失败, doc参数:{
         *    'err': '错误码',
         *    'msg': '错误信息'
         * }
         */
        updateUser: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            opts = opts || {};
            var token = opts.token || storage.getItem('token');
            if (!token) return cb(new Error('更新用户信息失败'), ERR.FA_NOAUTH);
            opts.token = token;
            this.post({
                    url: this.uri + '/user',
                    data: opts
                }, cb
            );
        },

        /**
         * 获取验证码
         * @function sso#getVerifyCode
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  key: 键值(必填)
         *  length: 验证码长度（可选）
         *  expire: 过期时间，单位秒（可选）
         * }
         * @param {callback} [cb=function(err, doc){}] 回调
         * @example
         * cb参数格式:
         * 成功, doc参数:{
         *  code: 验证码
         *  expire: 验证码过期时间
         * }
         * 失败，doc参数:{
         *    'err': '错误码',
         *    'msg': '错误信息'
         * }
         */
        getVerifyCode: function (opts, cb) {
            cb = cb || function () {
                };
            this.get({
                url: this.uri + '/verifyCode',
                data: opts,
            }, cb);
        },

        /**
         * 验证验证码
         * @function sso#checkVerifyCode
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  key: 键值(必填)
         *  code: 验证码(必填)
         * }
         * @param {callback} [cb=function(err, doc){}] 回调
         * @example
         * cb参数格式:
         * 成功, doc参数:{
         *  ret: 验证结果
         * }
         * 失败，doc参数:{
         *    'err': '错误码',
         *    'msg': '错误信息'
         * }
         */
        checkVerifyCode: function (opts, cb) {
            cb = cb || function () {
                };
            this.get({
                url: this.uri + '/verifyCode/check',
                data: opts,
            }, cb);
        }

    };


})();
