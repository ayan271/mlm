var jm = jm || {};
if((typeof exports !== 'undefined' && typeof module !== 'undefined')){
    require('jm-acl/dist/js/jm-sdk-acl');
    jm = require('jm-sdk-core');
}

var jm = jm || {};
if((typeof exports !== 'undefined' && typeof module !== 'undefined')){
    jm = require('jm-sdk-core');
}

(function(){
    var sdk = jm.sdk;
    var storage = sdk.storage;
    var ERR = sdk.consts.ERR;

    sdk.on('init', function (opts) {
        var model = 'activity';
        opts[model] = opts[model] || {};
        opts[model].uri = opts[model].uri || opts.uri;
        opts[model].timeout = opts[model].timeout || opts.timeout;
        sdk[model].init(opts[model]);
    });

    /**
     * 活动对象
     * @class  activity
     * @param {Object} opts 配置属性
     * 格式:{uri:'网络地址'}
     */
    sdk.activity = {
        init: function(opts) {
            opts = opts || {};
            var uri = opts.uri;
            var prefix = opts.prefix || '/activity';
            this.uri = uri + prefix;
            jm.enableEvent(this);
            sdk.enableAjax(this,{timeout:opts.timeout||0});
        },

        /**
         * 获取发布活动列表
         * @function activity#list
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   page: 第几页(可选),
         *   rows: 一页几行(可选,默认10),
         *   fields: {status:1},//筛选字段(可选)
         *   sort: 对查询数据排序(可选).
         *   appid: 应用id(可选),
         *   forum: 版块id(可选),
         *   fcode: 版块编码(可选),
         *   code: 活动编码(可选),
         *   tags: 标签查询(可选).
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:{
         *   rows:[{}]
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        list: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            // if (!opts.token) return cb(new Error('获取发布活动列表失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/list',
                data: opts
            }, cb);
        },

        /**
         * 获取活动详情
         * @function activity#info
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   id: 活动id(可选,id,code二选一),
         *   code: 活动编码(可选,id,code二选一),
         *   appid: 应用id(可选,随code一起提供)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:{
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        info: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            // if (!opts.token) return cb(new Error('获取活动详情失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/info',
                data: opts
            }, cb);
        },

        /**
         * 领取奖励
         * @function activity#take
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   id: 活动项id(必填).
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:
         * {
         *   type:'类型',
         *   rows:[{
         *     prop:{ _id: 57e5f68aaec31c1ecc1d6336, code: 'paodan', name: '炮弹' },
         *     expire:'过期时间戳',
         *     amount:'数量'
         *   }]
         * }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        take: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('领取奖励失败'), ERR.FA_NOAUTH);
            this.post({
                url: this.uri + '/take',
                data: opts
            }, cb);
        },

        /**
         * 获取未读活动
         * @function activity#unread
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   forum: 版块id(可选),
         *   fcode: 版块编码(可选)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:{
         * }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        unread: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('获取未读活动失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/unread',
                data: opts
            }, cb);
        }

    };

})();

var jm = jm || {};
if((typeof exports !== 'undefined' && typeof module !== 'undefined')){
    jm = require('jm-sdk-core');
}

(function(){
    var sdk = jm.sdk;
    var storage = sdk.storage;
    var ERR = sdk.consts.ERR;

    sdk.on('init', function (opts) {
        var model = 'agent';
        opts[model] = opts[model] || {};
        opts[model].uri = opts[model].uri || opts.uri;
        opts[model].timeout = opts[model].timeout || opts.timeout;
        sdk[model].init(opts[model]);
    });

    /**
     * 代理对象
     * @class  agent
     * @param {Object} opts 配置属性
     * 格式:{uri:'网络地址'}
     */
    sdk.agent = {
        init: function(opts) {
            opts = opts || {};
            var uri = opts.uri;
            var prefix = opts.prefix || '/agent';
            this.uri = uri + prefix;
            jm.enableEvent(this);
            sdk.enableAjax(this,{timeout:opts.timeout||0});
        },

        /**
         * 获取用户属于哪个渠道
         * @function agent#userAgent
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   "userId": 指定用户ObjectId,需有相应权限,如无,取当前token用户
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * 注:没渠道返回空对象
         * result参数:{
         *  _id: 渠道ID,
         *  code: 渠道编码,
         *  name: "渠道名"
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        userAgent: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('获取用户渠道失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/userAgent',
                data: opts
            }, cb);
        }
    };

})();

var jm = jm || {};
if((typeof exports !== 'undefined' && typeof module !== 'undefined')){
    jm = require('jm-sdk-core');
}

(function () {
    var sdk = jm.sdk;
    var storage = sdk.storage;
    var ERR = sdk.consts.ERR;

    sdk.on('init', function (opts) {
        var model = 'bank';
        opts[model] = opts[model] || {};
        opts[model].uri = opts[model].uri || opts.uri;
        opts[model].timeout = opts[model].timeout || opts.timeout;
        sdk[model].init(opts[model]);
    });

    /**
     * 银行对象
     * @class  bank
     * @param {Object} opts 配置属性
     * 格式:{uri:'网络地址'}
     */
    sdk.bank = {
        init: function (opts) {
            opts = opts || {};
            var uri = opts.uri;
            var prefix = opts.prefix || '/bank';
            this.uri = uri + prefix;
            jm.enableEvent(this);
            sdk.enableAjax(this,{timeout:opts.timeout||0});
        },

        /**
         * 获取账户信息
         * @function bank#query
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  token: (可选, 如果不填，自动从storage中取值)
         *  userId: 用户id(sso.user.id, 可选，如果不填，取当前登陆用户)
         *  accountId: 账户id(可选, 如果不填，取用户默认帐户)
         *  ctCode: [要查询的币种编码数组](可选, 如果不填，取全部)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:{
         *  id: (帐户id)
         *  name: "账户名",
         *  holds: {
         *      (ctcode): {
         *           overdraw: 透支数量
         *           amount: 数量
         *           amountLocked: 被锁定数量
         *           amountValid: 有效数量
         *      }
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        query: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('获取账户信息失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/query',
                data: opts
            }, cb);
        },

        /**
         * 获取账户信息列表
         * @function bank#accounts
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  token: (可选, 如果不填，自动从storage中取值)
         *  userId: 用户id(可选,默认查询所有跟自己相关的账户)
         *  accountId: 账户id(可选,默认查询所有账户)
         *  page: 第几页(可选)
         *  rows: 一页显示几行(可选)
         *  search: 模糊搜索用户(可选)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:{
         *      "page": 1,
         *      "pages": 2,
         *      "total": 3,
         *      "rows": [
         *          {
         *              "id": "账户id",
         *              "name": "账户名",
         *              "status": "账户状态",
         *               "user": {
         *                   "id": "用户id",
         *                   "userId": "用户ObjectId",
         *                   "name": "用户名",
         *                   .....
         *               },
         *               "holds": {
         *                   (ctcode): {
         *                       name: 币种名称
         *                       overdraw: 透支数量
         *                       amount: 数量
         *                       amountLocked: 被锁定数量
         *                       amountValid: 有效数量
         *                   }
         *               }
         *           }
         *      ]
         *     }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        accounts: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('获取账户信息失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/accounts',
                data: opts
            }, cb);
        },

        /**
         * 更新账户状态
         * @function bank#status
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   token: (可选, 如果不填，自动从storage中取值)
         *   userId: 用户ObjectId(必填).
         *   status: 状态(必填)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * result参数:{
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        status: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('更新状态失败'), ERR.FA_NOAUTH);
            this.post({
                url: this.uri + '/account/status',
                data: opts
            }, cb);
        },

        /**
         * 预授权
         * @function bank#preauth
         * @param {Object} [opts={}] 参数
         * @example
         * userId，accountId必填之一
         * opts参数:{
         *   token: (可选, 如果不填，自动从storage中取值)
         *   userId: 被预授权用户（可选，sso.user.id）
         *   accountId: 被预授权账户(可选，如果不填，取默认帐户),
         *   ctCode: 币种编码(必填)
         *   amount: 数量(必填，allAmount为1时可不填)
         *   allAmount: 转出全部(可选，为1时amount被忽略)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * result参数:{
         *  ctCode: 币种,
         *  amount: 数量,
         *  amountValid: 有效余额,
         *  totalAmount: 总授权数量
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        preauth: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('预授权失败'), ERR.FA_NOAUTH);
            this.post({
                url: this.uri + '/preauth',
                data: opts
            }, cb);
        },

        /**
         * 预授权取消
         * @function bank#preauthCancel
         * @param {Object} [opts={}] 参数
         * @example
         * userId，accountId必填之一
         * opts参数:{
         *   token: (可选, 如果不填，自动从storage中取值)
         *   userId: 被预授权用户（可选，sso.user.id）
         *   accountId: 被预授权账户(可选，如果不填，取默认帐户),
         *   ctCode: 币种编码(必填)
         *   amount: 数量(必填，allAmount为1时可不填)
         *   allAmount: 转出全部(可选，为1时amount被忽略)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * result参数:{
         *  ctCode: 币种,
         *  amount: 数量,
         *  amountValid: 有效余额,
         *  totalAmount: 总授权数量
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        preauthCancel: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('取消预授权失败'), ERR.FA_NOAUTH);
            this.delete({
                url: this.uri + '/preauth',
                data: opts
            }, cb);
        },

        /**
         * 预授权列表
         * @function bank#preauthList
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  token: (可选, 如果不填，自动从storage中取值)
         *  page: 第几页(可选)
         *  rows: 一页显示几行(可选)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * result参数:{
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        preauthList: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('获取预授权列表失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/preauth',
                data: opts
            }, cb);
        },

        /**
         * 转账
         * @function bank#transfer
         * @param {Object} [opts={}] 参数
         * @example
         * fromUserId，fromAccountId，toUserId，toAccountId必填之一
         * opts参数:{
         *   token: (可选, 如果不填，自动从storage中取值)
         *   fromUserId: 转出用户（可选，sso.user.id，如果不填，取当前用户）
         *   fromAccountId: 转出账户(可选，如果不填，取默认帐户),
         *   toUserId: 转入用户（可选，sso.user.id，如果不填，取当前用户）
         *   toAccountId: 转入账户(可选，如果不填，取默认帐户),
         *   ctCode: 币种编码(必填)
         *   amount: 数量(必填，allAmount为1时可不填)
         *   allAmount: 转出全部(可选，为1时amount被忽略)
         *   payId: 支付单号(可选)
         *   attach: 附加信息(可选)
         *   orderId: 商户自编订单号(可选)
         *   memo: 备注信息(可选)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * result参数:{
         *  ctCode: 币种,
         *  amount: 数量
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        transfer: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('转账失败'), ERR.FA_NOAUTH);
            this.post({
                url: this.uri + '/transfer',
                data: opts
            }, cb);
        },

        /**
         * 兑换
         * @function bank#exchange
         * @param {Object} [opts={}] 参数
         * @example
         * fromUserId,fromAccountId,toUserId,toAccountId都不填默认当前用户默认账户不同币种兑换
         * opts参数:{
         *   token: (可选, 如果不填，自动从storage中取值)
         *   fromUserId: 转出用户（可选，sso.user.id，如果不填，取当前用户）
         *   fromAccountId: 转出账户(可选，如果不填，取默认帐户),
         *   toUserId: 转入用户（可选，sso.user.id，如果不填，取当前用户）
         *   toAccountId: 转入账户(可选，如果不填，取默认帐户),
         *   fromCTCode: 转出币种编码(必填)
         *   fromAmount: 转出多少(必填)
         *   toCTCode: 转入币种编码(必填)
         *   toAmount: 转入多少(必填)
         *   payId: 支付单号(可选)
         *   attach: 附加信息(可选)
         *   orderId: 商户自编订单号(可选)
         *   memo: 备注信息(可选)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * result参数:{
         *   fromCTCode: 转出币种编码
         *   fromAmount: 转出多少
         *   toCTCode: 转入币种编码
         *   toAmount: 转入多少
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        exchange: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('兑换失败'), ERR.FA_NOAUTH);
            this.post({
                url: this.uri + '/exchange',
                data: opts
            }, cb);
        },

        /**
         * 更新账号密码
         * @function bank#updatePasswd
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   token: (可选, 如果不填，自动从storage中取值)
         *   passwd: 旧密码（必填）
         *   newPasswd: 新密码(必填),
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * result参数:{
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        updatePasswd: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('更新密码失败'), ERR.FA_NOAUTH);
            this.post({
                url: this.uri + '/updatePasswd',
                data: opts
            }, cb);
        },

        /**
         * 重置账号密码
         * @function bank#resetPasswd
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   token: (可选, 如果不填，自动从storage中取值)
         *   key: 手机号（必填）
         *   code: 验证码（必填）
         *   passwd: 新密码（必填）
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * result参数:{
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        resetPasswd: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('重置密码失败'), ERR.FA_NOAUTH);
            this.post({
                url: this.uri + '/resetPasswd',
                data: opts
            }, cb);
        },

        /**
         * 获取交易历史
         * @function bank#history
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   token: (可选, 如果不填，自动从storage中取值)
         *   userId: 用户id(可选,默认查询所有跟自己相关的交易记录,可传数组).
         *   startDate: 开始时间(可选).
         *   endDate: 结束时间(可选).
         *   ctCode: 币种(可选).
         *   statType: 统计类型(可选,0:按天,1:按月,2:按年).
         *   page: 第几页(可选).
         *   rows: 一页显示几行(可选).
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * result参数:{
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        history: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('获取交易历史失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/history',
                data: opts
            }, cb);
        },

        /**
         * 密码是否有效
         * @function bank#isVaildPasswd
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   token: (可选)
         *   userId: 用户id（可选,token不提供为必填）
         *   passwd: 密码（必填）
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * result参数:{
         *  ret:'true|false'
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        isVaildPasswd: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            //if (!opts.token) return cb(new Error('判断cp失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/isVaildPasswd',
                data: opts
            }, cb);
        },

        /**
         * 是否为cp用户
         * @function bank#isCP
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   token: (可选)
         *   userId: 用户id（可选）
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * result参数:{
         *  ret:'true|false'
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        isCP: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            //if (!opts.token) return cb(new Error('判断cp失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/isCP',
                data: opts
            }, cb);
        },

        /**
         * 币种间兑率
         * @function bank#exchangeRate
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * result参数:{
         *   "cny:tb":10,
         *   "ny:jb":1000,
         *   "dbj:tb":10,
         *   "dbj:jb":10000
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        exchangeRate: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};
            //opts.token = opts.token || storage.getItem("token");
            //if (!opts.token) return cb(new Error('获取币种兑率失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/exchangeRate',
                data: opts
            }, cb);
        }
    };

})();

var jm = jm || {};
if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    require('jm-config/dist/js/jm-sdk-config');
    jm = require('jm-sdk-core');
}

var jm = jm || {};
if((typeof exports !== 'undefined' && typeof module !== 'undefined')){
    jm = require('jm-sdk-core');
}

(function(){
    var sdk = jm.sdk;
    var storage = sdk.storage;
    var ERR = sdk.consts.ERR;

    sdk.on('init', function (opts) {
        var model = 'dak';
        opts[model] = opts[model] || {};
        opts[model].uri = opts[model].uri || opts.uri;
        opts[model].timeout = opts[model].timeout || opts.timeout;
        sdk[model].init(opts[model]);
    });

    /**
     * 邮件对象
     * @class  dak
     * @param {Object} opts 配置属性
     * 格式:{uri:'网络地址'}
     */
    sdk.dak = {
        init: function(opts) {
            opts = opts || {};
            var uri = opts.uri;
            var prefix = opts.prefix || '/dak';
            this.uri = uri + prefix;
            jm.enableEvent(this);
            sdk.enableAjax(this,{timeout:opts.timeout||0});
        },

        /**
         * 邮件列表
         * @function dak#listDaks
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   page: 第几页(可选),
         *   rows: 一页几行(可选,默认10),
         *   fields: {status:1},//筛选字段(可选)
         *   appid: 应用id(可选),
         *   type: 邮件类型(可选,默认全部,0:系统,1:用户),
         *   userId: 指定用户id(可选,需要权限,值可为数组或以','间隔的字符串).
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:{
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        listDaks: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('获取邮件列表失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/daks',
                data: opts
            }, cb);
        },

        /**
         * 获取邮件信息
         * @function dak#getDak
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   id: 邮件ID
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:{
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        getDak: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('获取邮件失败'), ERR.FA_NOAUTH);
            if(!opts.id) return cb(new Error('获取邮件失败'), ERR.FAIL);
            this.get({
                url: this.uri + '/daks/'+opts.id,
                data: opts
            }, cb);
        },

        /**
         * 发送邮件
         * @function dak#send
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   appid: 应用id(必填),
         *   userId: 指定用户id(可选,需要权限,值可为数组或以','间隔的字符串).
         *   title: 邮件标题(必填),
         *   content: 邮件内容(必填),
         *   attach: [{     //附件(可选)
         *      id: '唯一ID',//该项为用户背包中道具的唯一ID
         *      prop:'道具ID',//该项只允许具有权限的用户操作
         *      expire:'过期时间',
         *      amount:'数量',
         *   }],
         *   isSys: 是否系统邮件(可选,默认否)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:
         * {
         * }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        send: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('发送邮件失败'), ERR.FA_NOAUTH);
            this.post({
                url: this.uri + '/send',
                data: opts
            }, cb);
        },

        /**
         * 领取附件
         * @function dak#take
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   type: 邮件类型(可选,0:系统,1:用户)
         *   id: 邮件id(可选,值可为数组或以','间隔的字符串),
         *   all: 是否全部(可选,id和all必填之一)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:
         * {
         *   rows:[{
         *     prop:{ _id: 57e5f68aaec31c1ecc1d6336, code: 'paodan', name: '炮弹' },
         *     expire:'过期时间戳',
         *     amount:'数量'
         *   }]
         * }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        take: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('领取附件失败'), ERR.FA_NOAUTH);
            this.post({
                url: this.uri + '/take',
                data: opts
            }, cb);
        },

        /**
         * 删除邮件
         * @function dak#del
         * @param {Object} [opts={}] 参数
         * @example
         * id,all,read必填之一
         * opts参数:{
         *   type: 邮件类型(可选,0:系统,1:用户)
         *   id: 邮件id(可选,值可为数组或以','间隔的字符串),
         *   read: 是否只删除已读的(可选)
         *   all: 是否全部(可选)
         *   check: 是否检查附件未领(可选,默认false)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:
         * {
         * }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        del: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('删除邮件失败'), ERR.FA_NOAUTH);
            this.delete({
                url: this.uri + '/delete',
                data: opts
            }, cb);
        },

        /**
         * 获取未读邮件
         * @function dak#unread
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   type: 邮件类型(可选,0:系统,1:用户)
         *   appid: 应用id(可选)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:{
         *   rows:['id']  //未读的邮件id
         *  }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        unread: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('获取未读邮件失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/unread',
                data: opts
            }, cb);
        }

    };

})();

var jm = jm || {};
if((typeof exports !== 'undefined' && typeof module !== 'undefined')){
    jm = require('jm-sdk-core');
}

(function(){
    var sdk = jm.sdk;
    var storage = sdk.storage;
    var ERR = sdk.consts.ERR;

    sdk.on('init', function (opts) {
        var model = 'depot';
        opts[model] = opts[model] || {};
        opts[model].uri = opts[model].uri || opts.uri;
        opts[model].timeout = opts[model].timeout || opts.timeout;
        sdk[model].init(opts[model]);
    });

    /**
     * 用户仓库对象
     * @class  depot
     * @param {Object} opts 配置属性
     * 格式:{uri:'网络地址'}
     */
    sdk.depot = {
        init: function(opts) {
            opts = opts || {};
            var uri = opts.uri;
            var prefix = opts.prefix || '/depot';
            this.uri = uri + prefix;
            jm.enableEvent(this);
            sdk.enableAjax(this,{timeout:opts.timeout||0});
        },

        /**
         * 获取用户道具信息
         * @function depot#listProps
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   page: 第几页(可选),
         *   rows: 一页几行(可选,默认10),
         *   appId: 应用id(可选)
         *   mode: (可选,默认分页方式)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:
         * 结果结构一:{page:'第几页',rows:[{}],total:'总数',pages:'页数}
         * 结果结构二:{(code):{}}//以道具code为键,值为它的具体信息
         * {
         *   _id:'唯一id'
         *   userId:'用户ID',
         *   used: '使用状态',//该值不是必填项,只有useMode=0时才有效(0:未使用,1:使用中)
         *   prop:{ //道具具体信息
         *     logo:'图标地址',
         *     code:'道具编码',
         *     app:'应用id',//该值存在,代表只有在指定应用下才能使用
         *     name:'道具名称',
         *     description:'描述',
         *     type:'类型道具',//(0:礼包,1:虚拟币,2:道具)
         *     useMode:'使用方式',//(0:驻留品,1:消耗品,2:收集品)
         *     isStack:'是否堆叠的'
         *   }
         *   expire:'有效使用时间',
         *   amount:'可用数量'
         * }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        listProps: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('获取用户道具信息失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/props',
                data: opts
            }, cb);
        },

        /**
         * 获取指定道具信息
         * @function depot#getProp
         * @param {Object} [opts={}] 参数
         * @example
         * id|propId|propCode必填之一
         * opts参数:{
         *   id: 唯一id(可选),
         *   propId: 道具id(可选),
         *   propCode: 道具编码(可选)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:
         * {
         *   _id:'唯一id'
         *   userId:'用户ID',
         *   used: '使用状态',//该值不是必填项,只有useMode=0时才有效(0:未使用,1:使用中)
         *   prop:{ //道具具体信息
         *     logo:'图标地址',
         *     code:'道具编码',
         *     app:'应用id',//该值存在,代表只有在指定应用下才能使用
         *     name:'道具名称',
         *     description:'描述',
         *     type:'类型道具',//(0:礼包,1:虚拟币,2:道具)
         *     useMode:'使用方式',//(0:驻留品,1:消耗品,2:收集品)
         *     isStack:'是否堆叠的'
         *   }
         *   expire:'有效使用时间',
         *   amount:'可用数量'
         * }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        getProp: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('获取指定道具信息失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/prop',
                data: opts
            }, cb);
        },

        /**
         * 给予某用户道具
         * @function depot#giveProp
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   userId: 用户id(必填),
         *   prop: 道具id(可选,prop|ary必填之一),
         *   amount: 数量(可选,默认1),
         *   expire: 失效时间戳(可选,默认不失效,单位:毫秒)
         *   ary: 数组对象(可选,如该项提供优先采用;prop,amount,expire将不起作用,格式:[{prop:'id',amount:'数量',expire:''}]).
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:
         * {
         * }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        giveProp: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('给予某用户道具失败'), ERR.FA_NOAUTH);
            this.post({
                url: this.uri + '/props',
                data: opts
            }, cb);
        },

        /**
         * 使用道具
         * @function depot#useProp
         * @param {Object} [opts={}] 参数
         * @example
         * id|propId|propCode必填之一
         * opts参数:{
         *   id: 唯一id(可选),
         *   propId: 道具id(可选),
         *   propCode: 道具编码(可选)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:
         * {
         * }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        useProp: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('使用道具失败'), ERR.FA_NOAUTH);
            this.post({
                url: this.uri + '/useProp',
                data: opts
            }, cb);
        },

        /**
         * 销毁单个道具
         * @function depot#delProp
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   id: 唯一id(必填),
         *   amount: 指定数量(可选,默认全部)
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:
         * {
         * }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        delProp: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('销毁道具失败'), ERR.FA_NOAUTH);
            this.delete({
                url: this.uri + '/prop',
                data: opts
            }, cb);
        },

        /**
         * 提取用户道具
         * @function depot#takeProp
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   userId: 用户id(必填),
         *   id: 唯一id(可选,id|ary必填之一),
         *   amount: 数量(可选,默认1),
         *   ary: 数组对象(可选,如该项提供优先采用;id,amount将不起作用,格式:[{id:'id',amount:'数量'}]).
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:
         * {
         * }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        takeProp: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('提取用户道具失败'), ERR.FA_NOAUTH);
            this.post({
                url: this.uri + '/take',
                data: opts
            }, cb);
        }
    };

})();

var jm = jm || {};
if((typeof exports !== 'undefined' && typeof module !== 'undefined')){
    jm = require('jm-sdk-core');
}

(function(){
    var sdk = jm.sdk;
    var storage = sdk.storage;
    var ERR = sdk.consts.ERR;

    sdk.on('init', function (opts) {
        var model = 'pay';
        opts[model] = opts[model] || {};
        opts[model].uri = opts[model].uri || opts.uri;
        opts[model].timeout = opts[model].timeout || opts.timeout;
        sdk[model].init(opts[model]);
    });

    /**
     * 支付对象
     * @class  pay
     * @param {Object} opts 配置属性
     * 格式:{uri:'网络地址'}
     */
    sdk.pay = {
        init: function(opts) {
            opts = opts || {};
            var uri = opts.uri;
            var prefix = opts.prefix || '/pay';
            this.uri = uri + prefix;
            jm.enableEvent(this);
            sdk.enableAjax(this,{timeout:opts.timeout||0});
        },

        /**
         * 预请求支付，生成支付凭据
         * @function pay#prepay
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   "way": 支付平台(必填)//['platform','swiftpass','pingxx'].
         *   "channel": 支付方式(可选)//默认为'platform',根据way有所不同.
         *   "title": 商品的标题(必填)//该参数最长为 32 个 Unicode 字符.
         *   "content": 商品的描述信息(必填)//该参数最长为 128 个 Unicode 字符.
         *   "amount": 金额(必填)//整数，单位分.
         *   "currency": 货币种类(必填)//['cny','tb']
         *   "orderId": 订单id(必填)//由商城产生或其它途径产生,根据type有所不同.
         *   "note": 附加描述(可选)
         *   "succeeded": 成功回调地址,用于后端(可选,支付成功后对后期处理)
         *   "successURL": 成功回调地址,用于前端(可选|必填,不同渠道会有不同)
         *   "attach": {   //附加数据(可选)
         *      userId: 用户id //向谁支付
         *   }
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         */
        prepay: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('预请求支付失败'), ERR.FA_NOAUTH);
            this.post({
                url: this.uri + '/pays',
                data: opts
            }, cb);
        },

        /**
         * 请求退款
         * @function pay#refund
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   "payid": 支付id(必填).
         *   "amount": 金额(必填)//整数，单位分.
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         */
        refund: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            if (!opts.token) return cb(new Error('请求退款失败'), ERR.FA_NOAUTH);
            this.post({
                url: this.uri + '/refund',
                data: opts
            }, cb);
        }
    };

    sdk.enableAjax(sdk.pay);
})();

var jm = jm || {};
if((typeof exports !== 'undefined' && typeof module !== 'undefined')){
    jm = require('jm-sdk-core');
}

(function(){
    var sdk = jm.sdk;
    var storage = sdk.storage;
    var ERR = sdk.consts.ERR;

    sdk.on('init', function (opts) {
        var model = 'record';
        opts[model] = opts[model] || {};
        opts[model].uri = opts[model].uri || opts.uri;
        opts[model].timeout = opts[model].timeout || opts.timeout;
        sdk[model].init(opts[model]);
    });

    /**
     * 记录对象
     * @class  record
     * @param {Object} opts 配置属性
     * 格式:{uri:'网络地址'}
     */
    sdk.record = {
        init: function(opts) {
            opts = opts || {};
            var uri = opts.uri;
            var prefix = opts.prefix || '/record';
            this.uri = uri + prefix;
            jm.enableEvent(this);
            sdk.enableAjax(this,{timeout:opts.timeout||0});
        },

        /**
         * 统计
         * @function record#stat
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   type: 记录类型(必填).
         *   content: 内容(可选)
         *   userId: 用户id(可选,值可为数组或以','间隔的字符串).
         *   startDate: 开始时间(可选).
         *   endDate: 结束时间(可选).
         *   statType: 统计类型(可选,0:按天,1:按月,2:按年)
         *   unique: 唯一字段(可选,如:{crtime:1,content:1})
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:
         * {
         *   rows:[{
         *   }]
         * }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        stat: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            // if (!opts.token) return cb(new Error('统计失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/stat',
                data: opts
            }, cb);
        },

        /**
         * 获取之最一条记录
         * @function record#most
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *   type: 记录类型(必填).
         *   content: 内容(可选)
         *   userId: 用户id(可选,值可为数组或以','间隔的字符串).
         *   startDate: 开始时间(可选).
         *   endDate: 结束时间(可选).
         * }
         * @param {callback} [cb=function(err,result){}] 回调
         * @example
         * cb参数格式:
         * result参数:
         * {
         * }
         * err参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        most: function(opts, cb) {
            var self = this;
            opts = opts || {};
            cb = cb || function () {};
            opts.token = opts.token || storage.getItem("token");
            // if (!opts.token) return cb(new Error('获取失败'), ERR.FA_NOAUTH);
            this.get({
                url: this.uri + '/most',
                data: opts
            }, cb);
        }

    };

})();

var jm = jm || {};
if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    require('jm-sso/dist/js/jm-sdk-sso');
    jm = require('jm-sdk-core');
}

(function () {
    var sdk = jm.sdk;
    var storage = sdk.storage;
    var ERR = sdk.consts.ERR;
    var sso = sdk.sso;

    /**
     * 获取验证码
     * @function sso#verifyCode
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  mobile:'手机号(必填)'
     * }
     * @param {callback} [cb=function(err,result){}] 回调
     * @example
     * cb参数格式:
     * result参数:{
     *  time:'验证码过期时间'
     * }
     * err参数:{
     *    'err': '错误码',
     *    'msg': '错误信息'
     * }
     */
    sso.verifyCode = function (opts, cb) {
        cb = cb || function () {};
        this.get({
                url: this.uri + '/verifycode',
                data: opts
            },
            cb
        );
    };

    /**
     * 重置密码
     * @function sso#resetPasswd
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  key:'手机号(必填)',
     *  code:'验证码(必填)',
     *  passwd:'密码(必填)'
     * }
     * @param {callback} [cb=function(err,result){}] 回调
     * @example
     * cb参数格式:
     * result参数:{
     * }
     * err参数:{
     *    'err': '错误码',
     *    'msg': '错误信息'
     * }
     */
    sso.resetPasswd = function (opts, cb) {
        cb = cb || function () {};
        var self = this;
        this.post({
            url: this.uri + '/resetPasswd',
            data: opts
        }, cb);
    };


    /**
     * 绑定手机号
     * @function sso#bindMobile
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  code:'验证码(必填)',
     *  mobile:'手机号(必填)'
     * }
     * @param {callback} [cb=function(err,result){}] 回调
     * @example
     * cb参数格式:
     * result参数:{
     * }
     * err参数:{
     *    'err': '错误码',
     *    'msg': '错误信息'
     * }
     */
    sso.bindMobile = function (opts, cb) {
        opts = opts || {};
        cb = cb || function () {};
        opts.token = opts.token || storage.getItem("token");
        if (!opts.token) return cb(new Error('绑定手机号失败'), ERR.FA_NOAUTH);
        this.post({
            url: this.uri + '/bindMobile',
            data: opts
        }, cb);
    };

    /**
     * 获取用户列表
     * @function sso#getUsers
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  page: '第几页',
     *  rows: '一页几行',
     *  ids:['ObjectId'],
     *  keyword: '模糊查询关键字',
     *  fields: {}, //过滤字段
     *  sort: {} //按什么排序
     * }
     * @param {callback} [cb=function(err,result){}] 回调
     * @example
     * cb参数格式:
     * result参数:{
     *  rows:[]
     * }
     * err参数:{
     *    'err': '错误码',
     *    'msg': '错误信息'
     * }
     */
    sso.getUsers = function (opts, cb) {
        opts = opts || {};
        cb = cb || function () {};
        opts.token = opts.token || storage.getItem("token");
        if (!opts.token) return cb(new Error('获取用户列表失败'), ERR.FA_NOAUTH);
        this.get({
                url: this.uri + '/users',
                data: opts
            },
            cb
        );
    };

    /**
     * 获取单个用户信息
     * @function sso#findUser
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  id: 'id',//(可选)
     *  account: '账户',//(可选)
     *  mobile: '手机号'//(可选)
     * }
     * @param {callback} [cb=function(err,result){}] 回调
     * @example
     * cb参数格式:
     * result参数:{
     * }
     * err参数:{
     *    'err': '错误码',
     *    'msg': '错误信息'
     * }
     */
    sso.findUser = function (opts, cb) {
        opts = opts || {};
        cb = cb || function () {};
        opts.token = opts.token || storage.getItem("token");
        //if (!opts.token) return cb(new Error('查找用户失败'), ERR.FA_NOAUTH);
        this.get({
                url: this.uri + '/findUser',
                data: opts
            },
            cb
        );
    };

    /**
     * 判断是否登录
     * @function sso#isSignon
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  token: '令牌',//(必填)
     * }
     * @param {callback} [cb=function(err,result){}] 回调
     * @example
     * cb参数格式:
     * result参数:{
     *  ret:true|false
     * }
     * err参数:{
     *    'err': '错误码',
     *    'msg': '错误信息'
     * }
     */
    sso.isSignon = function (opts, cb) {
        opts = opts || {};
        cb = cb || function () {};
        opts.token = opts.token || storage.getItem("token");
        this.get({
                url: this.uri + '/isSignon',
                data: opts
            },
            cb
        );
    };

    /**
     * 是否开启效验码
     * @function sso#isCheckCode
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  token: '令牌',//(可选)
     * }
     * @param {callback} [cb=function(err,result){}] 回调
     * @example
     * cb参数格式:
     * result参数:{
     *  ret:true|false
     * }
     * err参数:{
     *    'err': '错误码',
     *    'msg': '错误信息'
     * }
     */
    sso.isCheckCode = function (opts, cb) {
        opts = opts || {};
        cb = cb || function () {};
        opts.token = opts.token || storage.getItem("token");
        this.get({
                url: this.uri + '/isCheckCode',
                data: opts
            },
            cb
        );
    };

    /**
     * 是否开启游客登录
     * @function sso#isCheckCode
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  token: '令牌',//(可选)
     * }
     * @param {callback} [cb=function(err,result){}] 回调
     * @example
     * cb参数格式:
     * result参数:{
     *  ret:true|false
     * }
     * err参数:{
     *    'err': '错误码',
     *    'msg': '错误信息'
     * }
     */
    sso.isGuest = function (opts, cb) {
        opts = opts || {};
        cb = cb || function () {};
        // opts.token = opts.token || storage.getItem("token");
        this.get({
                url: this.uri + '/isGuest',
                data: opts
            },
            cb
        );
    };

    /**
     * 移除指定用户
     * @function sso#removeUsers
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  id: ['用户ObjectId'],//(必填)
     * }
     * @param {callback} [cb=function(err,result){}] 回调
     * @example
     * cb参数格式:
     * result参数:{
     * }
     * err参数:{
     *    'err': '错误码',
     *    'msg': '错误信息'
     * }
     */
    sso.removeUsers = function (opts, cb) {
        opts = opts || {};
        cb = cb || function () {};
        opts.token = opts.token || storage.getItem("token");
        if (!opts.token) return cb(new Error('删除用户失败'), ERR.FA_NOAUTH);
        this.delete({
                url: this.uri + '/users',
                data: opts
            },
            cb
        );
    };

    /**
     * 创建用户
     * @function sso#createUser
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  token: token(可选, 如果不填,自动从localStorage获取),
     *  passwd: 密码(可选),
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
     * @param {callback} [cb=function(err,result){}] 回调
     * @example
     * cb参数格式:
     * result参数:{
     * }
     * err参数:{
     *    'err': '错误码',
     *    'msg': '错误信息'
     * }
     */
    sso.createUser = function (opts, cb) {
        opts = opts || {};
        cb = cb || function () {};
        opts.token = opts.token || storage.getItem("token");
        if (!opts.token) return cb(new Error('创建用户失败'), ERR.FA_NOAUTH);
        this.post({
                url: this.uri + '/users',
                data: opts
            },
            cb
        );
    };

    /**
     * 更新用户信息
     * @function sso#updateUser
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  token: token(可选, 如果不填,自动从localStorage获取),
     *  userId: 指定用户OjbectId(可选,需要当前操作用户有相应权限)
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
    sso.updateUser = function (opts, cb) {
        var self = this;
        cb = cb || function () {};
        opts = opts || {};
        var token = opts.token || storage.getItem('token');
        if (!token) return cb(new Error('更新用户信息失败'), ERR.FA_NOAUTH);
        opts.token = token;
        var p = '/user';
        if(opts.userId){
            p = '/users/'+opts.userId;
        }
        this.post({
                url: this.uri + p,
                data: opts
            }, cb
        );
    };

    /**
     * 排名
     * @function sso#ranking
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  page:'第几页',
     *  rows:'一页几行',
     *  sort:'排名规则'
     * }
     * sort例子:
     * sort:{
     * 'record.jb':-1,
     * 'record.cny':-1,
     * 'record.tb':-1,
     * 'record.dbj':-1,
     * }
     * 注:-1代表降序,1代表升序,可组合
     * @param {callback} [cb=function(err,result){}] 回调
     * @example
     * cb参数格式:
     * result参数:{
     *  rows:[{}],
     *  me:'自己排名信息'
     * }
     * err参数:{
     *    'err': '错误码',
     *    'msg': '错误信息'
     * }
     */
    sso.ranking = function (opts, cb) {
        opts = opts || {};
        cb = cb || function () {};
        opts.token = opts.token || storage.getItem("token");
        this.get({
                url: this.uri + '/ranking',
                data: opts
            },
            cb
        );
    };

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
    sso.getUser= function (opts, cb) {
        var self = this;
        cb = cb || function () {};
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
                    self.user.nick||(self.user.nick='');
                    doc = self.user;
                }else{
                    err = new Error('获取用户信息失败');
                }
                cb(err, doc);
                self.emit('getUser', err, doc);
            }
        );
    };

    /**
     * 检测用户是否存在
     * @function sso#checkUser
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  any: '检测信息',//(必填)
     * }
     * @param {callback} [cb=function(err,result){}] 回调
     * @example
     * cb参数格式:
     * result参数:{
     *  ret:true|false
     * }
     * err参数:{
     *    'err': '错误码',
     *    'msg': '错误信息'
     * }
     */
    sso.checkUser = function (opts, cb) {
        opts = opts || {};
        cb = cb || function () {};
        // opts.token = opts.token || storage.getItem("token");
        this.get({
                url: this.uri + '/checkUser',
                data: opts
            },
            cb
        );
    };

})();
