var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

/**
 * ms对象
 * @class  ms
 */
(function(){
    if(jm.ms) return;
    var ERR = jm.ERR;
    jm.ms = function(opts){
        var router = jm.ms.router(opts);
        return router;
    };

    /**
     * 创建一个代理路由
     * 支持多种参数格式, 例如
     * proxy({uri:uri}, cb)
     * proxy(uri, cb)
     * 可以没有回调函数cb
     * proxy({uri:uri})
     * proxy(uri)
     * @function ms#proxy
     * @param {Object} opts 参数
     * @example
     * opts参数:{
         *  uri: 目标uri(必填)
         * }
     * @param cb 回调cb(err,doc)
     * @returns {Router}
     */
    jm.ms.proxy = function(opts, cb){
        opts || ( opts = {} );
        var err = null;
        var doc = null;
        if(typeof opts === 'string') {
            opts = {uri:opts};
        }
        if(!opts.uri){
            doc = ERR.FA_PARAMS;
            err = new Error(doc.msg, doc.err);
            if (!cb) throw err;
        }
        var router = jm.ms();
        jm.ms.client(opts, function(err, client){
            if(err) return cb(err, client);
            router.use(function(opts, cb) {
                client.request(opts, cb);
            });
            router.client = client;
            if(cb) cb(null, router);
        });
        return router;
    };

})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

(function(){
    if(jm.ms.consts) return;
    var ms = jm.ms;

    var ERRCODE_MS = 900;
    jm.ERR.ms = {
        FA_INVALIDTYPE: {
            err: ERRCODE_MS++,
            msg: '无效的类型'
        }
    };

    ms.consts = {
    };

})();

var jm = jm || {};
if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    jm = require('jm-core');
}

(function () {
    if(jm.ms.pathToRegexp) return;
    jm.ms.pathToRegexp = pathToRegexp;
    pathToRegexp.parse = parse;
    pathToRegexp.compile = compile;
    pathToRegexp.tokensToFunction = tokensToFunction;
    pathToRegexp.tokensToRegExp = tokensToRegExp;

    var isarray = Array.isArray || function (arr) {
            return Object.prototype.toString.call(arr) == '[object Array]';
        };

    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
        // Match escaped characters that would otherwise appear in future matches.
        // This allows the user to escape special characters that won't transform.
        '(\\\\.)',
        // Match Express-style parameters and un-named parameters with a prefix
        // and optional suffixes. Matches appear as:
        //
        // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
        // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
        // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
        '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
    ].join('|'), 'g');

    /**
     * Parse a string for the raw tokens.
     *
     * @param  {String} str
     * @return {Array}
     */
    function parse(str) {
        var tokens = []
        var key = 0
        var index = 0
        var path = ''
        var res

        while ((res = PATH_REGEXP.exec(str)) != null) {
            var m = res[0]
            var escaped = res[1]
            var offset = res.index
            path += str.slice(index, offset)
            index = offset + m.length

            // Ignore already escaped sequences.
            if (escaped) {
                path += escaped[1]
                continue
            }

            // Push the current path onto the tokens.
            if (path) {
                tokens.push(path)
                path = ''
            }

            var prefix = res[2]
            var name = res[3]
            var capture = res[4]
            var group = res[5]
            var suffix = res[6]
            var asterisk = res[7]

            var repeat = suffix === '+' || suffix === '*'
            var optional = suffix === '?' || suffix === '*'
            var delimiter = prefix || '/'
            var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

            tokens.push({
                name: name || key++,
                prefix: prefix || '',
                delimiter: delimiter,
                optional: optional,
                repeat: repeat,
                pattern: escapeGroup(pattern)
            })
        }

        // Match any characters still remaining.
        if (index < str.length) {
            path += str.substr(index)
        }

        // If the path exists, push it onto the end.
        if (path) {
            tokens.push(path)
        }

        return tokens
    }

    /**
     * Compile a string to a template function for the path.
     *
     * @param  {String}   str
     * @return {Function}
     */
    function compile(str) {
        return tokensToFunction(parse(str))
    }

    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction(tokens) {
        // Compile all the tokens into regexps.
        var matches = new Array(tokens.length)

        // Compile all the patterns before compilation.
        for (var i = 0; i < tokens.length; i++) {
            if (typeof tokens[i] === 'object') {
                matches[i] = new RegExp('^' + tokens[i].pattern + '$')
            }
        }

        return function (obj) {
            var path = ''
            var data = obj || {}

            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i]

                if (typeof token === 'string') {
                    path += token

                    continue
                }

                var value = data[token.name]
                var segment

                if (value == null) {
                    if (token.optional) {
                        continue
                    } else {
                        throw new TypeError('Expected "' + token.name + '" to be defined')
                    }
                }

                if (isarray(value)) {
                    if (!token.repeat) {
                        throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
                    }

                    if (value.length === 0) {
                        if (token.optional) {
                            continue
                        } else {
                            throw new TypeError('Expected "' + token.name + '" to not be empty')
                        }
                    }

                    for (var j = 0; j < value.length; j++) {
                        segment = encodeURIComponent(value[j])

                        if (!matches[i].test(segment)) {
                            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
                        }

                        path += (j === 0 ? token.prefix : token.delimiter) + segment
                    }

                    continue
                }

                segment = encodeURIComponent(value)

                if (!matches[i].test(segment)) {
                    throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
                }

                path += token.prefix + segment
            }

            return path
        }
    }

    /**
     * Escape a regular expression string.
     *
     * @param  {String} str
     * @return {String}
     */
    function escapeString(str) {
        return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {String} group
     * @return {String}
     */
    function escapeGroup(group) {
        return group.replace(/([=!:$\/()])/g, '\\$1')
    }

    /**
     * Attach the keys as a property of the regexp.
     *
     * @param  {RegExp} re
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function attachKeys(re, keys) {
        re.keys = keys
        return re
    }

    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {String}
     */
    function flags(options) {
        return options.sensitive ? '' : 'i'
    }

    /**
     * Pull out keys from a regexp.
     *
     * @param  {RegExp} path
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function regexpToRegexp(path, keys) {
        // Use a negative lookahead to match only capturing groups.
        var groups = path.source.match(/\((?!\?)/g)

        if (groups) {
            for (var i = 0; i < groups.length; i++) {
                keys.push({
                    name: i,
                    prefix: null,
                    delimiter: null,
                    optional: false,
                    repeat: false,
                    pattern: null
                })
            }
        }

        return attachKeys(path, keys)
    }

    /**
     * Transform an array into a regexp.
     *
     * @param  {Array}  path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function arrayToRegexp(path, keys, options) {
        var parts = []

        for (var i = 0; i < path.length; i++) {
            parts.push(pathToRegexp(path[i], keys, options).source)
        }

        var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

        return attachKeys(regexp, keys)
    }

    /**
     * Create a path regexp from string input.
     *
     * @param  {String} path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function stringToRegexp(path, keys, options) {
        var tokens = parse(path)
        var re = tokensToRegExp(tokens, options)

        // Attach keys back to the regexp.
        for (var i = 0; i < tokens.length; i++) {
            if (typeof tokens[i] !== 'string') {
                keys.push(tokens[i])
            }
        }

        return attachKeys(re, keys)
    }

    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {Array}  tokens
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function tokensToRegExp(tokens, options) {
        options = options || {}

        var strict = options.strict
        var end = options.end !== false
        var route = ''
        var lastToken = tokens[tokens.length - 1]
        var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

        // Iterate over the tokens and create our regexp string.
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i]

            if (typeof token === 'string') {
                route += escapeString(token)
            } else {
                var prefix = escapeString(token.prefix)
                var capture = token.pattern

                if (token.repeat) {
                    capture += '(?:' + prefix + capture + ')*'
                }

                if (token.optional) {
                    if (prefix) {
                        capture = '(?:' + prefix + '(' + capture + '))?'
                    } else {
                        capture = '(' + capture + ')?'
                    }
                } else {
                    capture = prefix + '(' + capture + ')'
                }

                route += capture
            }
        }

        // In non-strict mode we allow a slash at the end of match. If the path to
        // match already ends with a slash, we remove it for consistency. The slash
        // is valid at the end of a path match, not in the middle. This is important
        // in non-ending mode, where "/test/" shouldn't match "/test//route".
        if (!strict) {
            route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
        }

        if (end) {
            route += '$'
        } else {
            // In non-ending mode, we need the capturing groups to match as much as
            // possible by using a positive lookahead to the end or next path segment.
            route += strict && endsWithSlash ? '' : '(?=\\/|$)'
        }

        return new RegExp('^' + route, flags(options))
    }

    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(String|RegExp|Array)} path
     * @param  {Array}                 [keys]
     * @param  {Object}                [options]
     * @return {RegExp}
     */
    function pathToRegexp(path, keys, options) {
        keys = keys || []

        if (!isarray(keys)) {
            options = keys
            keys = []
        } else if (!options) {
            options = {}
        }

        if (path instanceof RegExp) {
            return regexpToRegexp(path, keys, options)
        }

        if (isarray(path)) {
            return arrayToRegexp(path, keys, options)
        }

        return stringToRegexp(path, keys, options)
    }

})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

(function(){
    if(jm.ms.Route) return;
    var ms = jm.ms;
    var ERR = jm.ERR;
    var pathToRegexp = ms.pathToRegexp;

    /**
     * Route
     * @param {Object} opts 参数
     * @example
     * opts参数:{
         *  uri: 接口路径(必填)
         *  type: 请求类型(可选)
         *  fn: 接口处理函数 function(opts, cb, next){}(必填)
         * }
     * @param cb 回调cb(err,doc)
     * @returns {Object}
     */
    var Route = jm.TagObject.extend({
        _className: 'route',

        ctor: function(opts) {
            this._super();
            if(opts) this.attr(opts);
            this._fns = [];
            Object.defineProperty(this, 'fns', { value: this._fns, writable: false });
            this.uri = this.uri || '/';
            this.keys = [];
            this.regexp = pathToRegexp(this.uri, this.keys, opts);
            if (this.uri === '/' && opts.end === false) {
                this.regexp.fast_slash = true;
            }
            if(this.type == undefined) {
                this.allType = true;
            }
            var fns = opts.fn;
            if(!Array.isArray(fns)){
                fns = [fns];
            }
            for (var i = 0; i < fns.length; i++) {
                var fn = fns[i];
                if (typeof fn !== 'function') {
                    var type = toString.call(fn);
                    var msg = 'requires callback functions but got a ' + type;
                    throw new TypeError(msg);
                }
                this._fns.push(fn);
            }
        },

        /**
         * dispatch opts, cb into this route
         * @private
         */
        handle: function dispatch(opts, cb, next) {
            var idx = 0;
            var fns = this.fns;
            if (fns.length === 0) {
                return next();
            }
            _next();
            function _next(err, doc) {
                if (err) {
                    if(err === 'route')
                        return next();
                    else
                        return cb(err, doc);
                }
                var fn = fns[idx++];
                if (!fn) {
                    return next(err);
                }
                try {
                    fn(opts, cb, _next);
                } catch (err) {
                    _next(err);
                }
            }
        },

        /**
         * Check if this route matches `uri`, if so
         * populate `.params`.
         *
         * @param {String} uri
         * @return {Boolean}
         * @api private
         */

        match: function match(uri, type) {
            if(type){
                type = type.toLowerCase();
            }
            if (type != this.type && !this.allType) {
                return false;
            }
            if (uri == null) {
                // no uri, nothing matches
                this.params = undefined;
                this.uri = undefined;
                return false;
            }

            if (this.regexp.fast_slash) {
                // fast uri non-ending match for / (everything matches)
                this.params = {};
                this.uri = '';
                return true;
            }

            var m = this.regexp.exec(uri);

            if (!m) {
                this.params = undefined;
                this.uri = undefined;
                return false;
            }

            // store values
            this.params = {};
            this.uri = m[0];

            var keys = this.keys;
            var params = this.params;

            for (var i = 1; i < m.length; i++) {
                var key = keys[i - 1];
                var prop = key.name;
                params[prop] = m[i];
            }

            return true;
        }

    });

    ms.Route = Route;
    ms.route = function(opts) {
        return new Route(opts);
    };

})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

(function(){
    if(jm.ms.Router) return;
    var ms = jm.ms;
    var ERR = jm.ERR;

    var cb_default = function(err, doc){};
    var slice = Array.prototype.slice;

    var Router = jm.TagObject.extend({
        _className: 'router',

        /**
         * 添加接口定义
         * @function Router#add
         * @param {Object} opts 参数
         * @example
         * opts参数:{
         *  sensitive: 是否大小写敏感(可选)
         *  strict: 是否检查末尾的分隔符(可选)
         * }
         * @param cb 回调cb(err,doc)
         * @returns {jm.ms}
         */
        ctor: function(opts) {
            var self = this;
            this._super();
            if(opts) this.attr(opts);
            this._routes = [];
            Object.defineProperty(this, 'routes', { value: this._routes, writable: false });

            // alias methods
            ms.utils.enableType(self, ['get', 'post', 'put', 'delete']);
        },

        /**
         * 清空接口定义
         * @function Router#clear
         * @param {Object} opts 参数
         * @example
         * opts参数:{
         * }
         * @param cb 回调cb(err,doc)
         * @returns {Object}
         */
        clear: function(opts, cb) {
            this._routes.splice(0);
            if(cb) cb(null, true);
            return this;
        },

        /**
         * 添加接口定义
         * @function Router#_add
         * @param {Object} opts 参数
         * @example
         * opts参数:{
         *  uri: 接口路径(必填)
         *  type: 请求类型(可选)
         *  fn: 接口处理函数 function(opts, cb){}, 支持数组(必填)
         * }
         * @param cb 回调cb(err,doc)
         * @returns {Object}
         */
        _add: function(opts, cb) {
            opts = opts || {};
            var err = null;
            var doc = null;
            if(!opts.uri || !opts.fn){
                doc = ERR.FA_PARAMS;
                err = new Error(doc.msg);
                if(!cb) throw err;
            }else{
                this.emit('add', opts);
                var o = {};
                for(var key in opts) {
                    o[key] = opts[key];
                }
                if(o.mergeParams === undefined) o.mergeParams =  this.mergeParams;
                if(o.sensitive === undefined) o.sensitive =  this.sensitive;
                if(o.strict === undefined) o.strict =  this.strict;
                var route = ms.route(o);
                this._routes.push(route);
            }
            if(cb) cb(err, doc);
            return this;
        },

        /**
         * 添加接口定义
         * 支持多种参数格式, 例如
         * add({uri:uri, type:type, fn:fn}, cb)
         * add({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]}, cb)
         * 可以没有回调函数cb
         * add({uri:uri, type:type, fn:fn})
         * add({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]})
         * 以下用法不能包含cb
         * add(uri, fn)
         * add(uri, fn1, fn2, ..., fnn)
         * add(uri, [fn1, fn2, ..,fnn])
         * add(uri, type, fn)
         * add(uri, type, fn1, fn2, ..., fnn)
         * add(uri, type, [fn1, fn2, ..,fnn])
         * @function Router#add
         * @param {Object} opts 参数
         * @example
         * opts参数:{
         *  uri: 接口路径(必填)
         *  type: 请求类型(可选)
         *  fn: 接口处理函数 function(opts, cb){}, 支持数组(必填)
         * }
         * @param cb 回调cb(err,doc)
         * @returns {Object}
         */
        add: function(opts, cb) {
            if(typeof opts === 'string') {
                opts = {
                    uri: opts
                };
                if(typeof cb === 'string') {
                    opts.type = cb;
                    if(Array.isArray(arguments[2])){
                        opts.fn = arguments[2];
                    }else{
                        opts.fn = slice.call(arguments, 2);
                    }
                }else if(Array.isArray(cb)) {
                    opts.fn = cb;
                }else {
                    opts.fn = slice.call(arguments, 1);
                }
                cb = null;
            }
            return this._add(opts, cb);
        },

        /**
         * 引用路由定义
         * @function Router#_use
         * @param {Object} opts 参数
         * @example
         * opts参数:{
         *  uri: 接口路径(可选)
         *  fn: 接口处理函数 router实例 或者 function(opts, cb){}(支持函数数组) 或者含有request或handle函数的对象(必填)
         * }
         * @param cb 回调cb(err,doc)
         * @returns {Object}
         */
        _use: function(opts, cb) {
            opts = opts || {};
            var err = null;
            var doc = null;
            if(opts && opts instanceof Router) {
                opts = {
                    fn: opts
                };
            }
            if(!opts.fn){
                doc = ERR.FA_PARAMS;
                err = new Error(doc.msg, doc.err);
                if(!cb) throw err;
            }else{
                this.emit('use', opts);
                opts.strict = false;
                opts.end = false;
                opts.uri = opts.uri || '/';
                if(opts.fn instanceof Router){
                    var router = opts.fn;
                    opts.router = router;
                    opts.fn = function(opts, cb, next) {
                        router.handle(opts, cb, next);
                    }
                } else if(typeof opts.fn === "object" ) {
                    var router = opts.fn;
                    if(router.request) {
                        opts.router = router;
                        opts.fn = function(opts, cb, next) {
                            router.request(opts, function(err, doc){
                                cb(err, doc);
                                next();
                            });
                        }
                    } else if(router.handle) {
                        opts.router = router;
                        opts.fn = function(opts, cb, next) {
                            router.handle(opts, cb, next);
                        }
                    }
                }
                return this._add(opts, cb);
            }
            if(cb) cb(err, doc);
            return this;
        },

        /**
         * 引用路由定义
         * 支持多种参数格式, 例如
         * use({uri:uri, fn:fn}, cb)
         * use({uri:uri, fn:[fn1, fn2, ..., fnn]}, cb)
         * use({uri:uri, fn:router}, cb)
         * use({uri:uri, fn:obj}, cb)
         * use(router, cb)
         * 可以没有回调函数cb
         * use({uri:uri, fn:fn})
         * use({uri:uri, fn:[fn1, fn2, ..., fnn]})
         * use({uri:uri, fn:router})
         * use({uri:uri, fn:obj})
         * use(router)
         * use(obj) obj必须实现了request或者handle函数之一，优先使用request
         * 以下用法不能包含cb
         * use(uri, fn)
         * use(uri, fn1, fn2, ..., fnn)
         * use(uri, [fn1, fn2, ..,fnn])
         * use(uri, router)
         * use(uri, obj)
         * use(uri, fn)
         * use(fn1, fn2, ..., fnn)
         * use([fn1, fn2, ..,fnn])
         * @function Router#use
         * @param {Object} opts 参数
         * @example
         * opts参数:{
         *  uri: 接口路径(可选)
         *  fn: 接口处理函数 router实例 或者 function(opts, cb){}(必填)
         * }
         * @param cb 回调cb(err,doc)
         * @returns {Object}
         */
        use: function(opts, cb) {
            if(typeof opts === 'string') {
                opts = {
                    uri: opts
                };
                if (typeof cb === 'object') {   //object 或者 数组
                    opts.fn = cb;
                } else {
                    opts.fn = slice.call(arguments, 1);
                }
                cb = null;
            }else if(typeof opts === 'function') {
                opts = {
                    fn: slice.call(arguments, 0)
                };
                cb = null;
            }else if(Array.isArray(opts)) {
                opts = {
                    fn: opts
                };
                cb = null;
            }else if(typeof opts === 'object') {
                if(!opts.fn) {
                    opts = {
                        fn: opts
                    };
                }
            }

            return this._use(opts, cb);
        },

        _proxy: function(opts, cb) {
            var self = this;
            opts || (opts = {});
            cb || ( cb = function(err, doc){
                if(err) throw err;
            });
            if(!opts.target){
                var doc = ERR.FA_PARAMS;
                var err = new Error(doc.msg, doc.err);
                cb(err, doc);
            }
            this.emit('proxy', opts);
            if(typeof opts.target === 'string') {
                opts.target = {uri:opts.target};
            }
            if(opts.changeOrigin) {
                ms.client(opts.target, function(err, client){
                    if(err) return cb(err, client);
                    self.use(opts.uri, function(opts, cb) {
                        client.request(opts, cb);
                    });
                    cb();
                });
            }else {
                ms.proxy(opts.target, function(err, doc){
                    if(err) return cb(err, doc)
                    self.use(opts.uri, doc);
                    cb();
                })
            }

            return this;
        },
        /**
         * 添加代理
         * 支持多种参数格式, 例如
         * proxy({uri:uri, target:target, changeOrigin:true}, cb)
         * proxy(uri, target, changeOrigin, cb)
         * proxy(uri, target, cb)
         * 可以没有回调函数cb
         * proxy({uri:uri, target:target, changeOrigin:true})
         * proxy(uri, target, changeOrigin)
         * proxy(uri, target)
         * @function Router#proxy
         * @param {Object} opts 参数
         * @example
         * opts参数:{
         *  uri: 接口路径(必填)
         *  target: 目标路径或者参数(必填)
         *  changeOrigin: 是否改变originUri(可选， 默认fasle)
         * }
         * @param cb 回调cb(err,doc)
         * @returns {this}
         */
        proxy: function(uri, target, changeOrigin, cb) {
            var opts = uri;
            if(typeof uri === 'string') {
                opts = {
                    uri: uri,
                    target: target
                };
                if(typeof changeOrigin === 'boolean') {
                    opts.changeOrigin = changeOrigin;
                } else if (changeOrigin && typeof changeOrigin === 'function') {
                    cb = changeOrigin;
                }
            }
            return this._proxy(opts, cb);
        },

        /**
         * 请求
         * 支持多种参数格式, 例如
         * request({uri:uri, type:type, data:data, params:params, timeout:timeout}, cb)
         * request({uri:uri, type:type, data:data, params:params, timeout:timeout})
         * request(uri, type, data, params, timeout, cb)
         * request(uri, type, data, params, cb)
         * request(uri, type, data, cb)
         * request(uri, type, cb)
         * request(uri, cb)
         * request(uri, type, data, params, timeout)
         * request(uri, type, data, params)
         * request(uri, type, data)
         * request(uri, type)
         * request(uri)
         * request(uri, type, data, timeout, cb)
         * request(uri, type, timeout, cb)
         * request(uri, timeout, cb)
         * request(uri, type, data, timeout)
         * request(uri, type, timeout)
         * request(uri, timeout)
         * @function Router#request
         * @param {Object} opts 参数
         * @example
         * opts参数:{
         *  uri: 接口路径(必填)
         *  type: 请求类型(可选)
         *  data: 请求数据(可选)
         *  params: 请求参数(可选)
         *  timeout: 请求超时(可选, 单位毫秒, 默认0表示不检测超时)
         * }
         * @param cb 回调(可选)cb(err,doc)
         * @returns {Object}
         */
        request: function(opts, cb) {
            var r = ms.utils.preRequest.apply(this, arguments);
            return this.handle(r.opts, r.cb || cb_default);
        },

        handle: function handle(opts, cb, next) {
            if(!next){
                //is a request
                var _opts = opts;
                var _cb = cb;
                opts = {};
                for(var key in _opts) {
                    opts[key] =  _opts[key];
                }
                cb = function(err, doc){
                    if(cb.done) return;
                    cb.done = true;
                    _cb(err, doc);
                };
                next = function(){
                    cb(new Error(jm.ERR.FA_NOTFOUND.msg), jm.ERR.FA_NOTFOUND);
                };
            }

            var self = this;
            var idx = 0;
            var routes = self.routes;
            var parentParams = opts.params;
            var parentUri = opts.baseUri || '';
            var done = restore(next, opts, 'baseUri', 'params');
            opts.originalUri = opts.originalUri || opts.uri;
            var uri = opts.uri;
            _next();
            return self;
            function _next() {
                if(cb.done){
                    return done();
                }
                opts.baseUri = parentUri;
                opts.uri = uri;
                // no more matching layers
                if (idx >= routes.length) {
                    return done();
                }
                var match = false;
                var route;
                while (!match && idx < routes.length) {
                    route = routes[idx++];
                    if (!route) {
                        continue;
                    }
                    try {
                        match = route.match(opts.uri, opts.type);
                    } catch (err) {
                        return done(err);
                    }
                    if (!match) {
                        continue;
                    }
                }
                if (!match) {
                    return done();
                }
                opts.params = {};
                for(var key in parentParams){
                    opts.params[key] = parentParams[key];
                }
                for(var key in route.params){
                    opts.params[key] = route.params[key];
                }

                if(route.router){
                    opts.baseUri = parentUri + route.uri;
                    opts.uri = opts.uri.replace(route.uri, '');
                }
                route.handle(opts, cb, _next);
            }
            // restore obj props after function
            function restore(fn, obj) {
                var props = new Array(arguments.length - 2);
                var vals = new Array(arguments.length - 2);

                for (var i = 0; i < props.length; i++) {
                    props[i] = arguments[i + 2];
                    vals[i] = obj[props[i]];
                }

                return function(err){
                    // restore vals
                    for (var i = 0; i < props.length; i++) {
                        obj[props[i]] = vals[i];
                    }

                    if(fn) fn.apply(this, arguments);
                    return self;
                };
            }
        }
    });

    ms.Router = Router;
    ms.router = function(opts) {
        return new Router(opts);
    };

})();

var jm = jm || {};
if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    jm = require('jm-core');
}

(function () {
    if(jm.ms.utils) return;
    var slice = Array.prototype.slice;
    var ms = jm.ms;

    /**
     * utils对象
     * @class  utils
     */
    ms.utils = {

        formatJSON: function (o) {
            return JSON.stringify(o, null, 2);
        },

        getUriProtocol: function (uri) {
            if (!uri) return null;
            return uri.substring(0, uri.indexOf(':'));
        },

        getUriPath: function (uri) {
            var idx = uri.indexOf('//');
            if(idx == -1) return '';
            var idx = uri.indexOf('/', idx + 2);
            if(idx == -1) return '';
            uri = uri.substr(idx);
            idx = uri.indexOf('#');
            if(idx == -1) idx = uri.indexOf('?');
            if(idx != -1) uri = uri.substr(0, idx);
            return uri;
        },

        enableType: function(obj, types) {
            if(!Array.isArray(types)){
                types = [types];
            }
            types.forEach(function(type) {
                obj[type] = function(opts, cb) {
                    if(typeof opts === 'string') {
                        var args = Array.prototype.slice.call(arguments, 0);
                        args.splice(1, 0, type);
                        return obj.request.apply(obj, args);
                    }
                    opts.type = type;
                    return obj.request(opts, cb);
                };
            });
        },

        preRequest: function(opts, cb) {
            if(typeof opts === 'string') {
                var numargs = arguments.length;
                var args = slice.call(arguments, 0);
                cb = null;
                if(typeof args[numargs - 1] === 'function'){
                    cb = args[numargs - 1];
                    numargs--;
                }
                opts = {
                    uri: opts
                };
                if(typeof args[numargs - 1] === 'number'){
                    opts.timeout = args[numargs - 1];
                    numargs--;
                }
                var i = 1;
                if(i<numargs && args[i]){
                    opts.type = args[i];
                }
                i++;
                if(i<numargs && args[i]){
                    opts.data = args[i];
                }
                i++;
                if(i<numargs && args[i]){
                    opts.params = args[i];
                }
            }

            return {
                opts: opts,
                cb: cb
            };
        }
    };
})();

var jm = jm || {};
if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    jm = require('jm-core');
}

(function () {
    if(jm.ms.client) return;
    var ms = jm.ms;
    var ERR = jm.ERR;
    var registries = jm.root.registries;
    registries.ms = {
        client: {
            types: {}
        }
    };
    var regTypes = registries.ms.client.types;

    ms.registClientType = function (opts, cb) {
        opts = opts || {};
        var err = null;
        var doc = null;
        if (!opts.type || !opts.fn) {
            err = new Error('invalid params');
            doc = ERR.FA_PARAMS;
        } else {
            var type = opts.type.toLowerCase();
            regTypes[type] = {
                type: type,
                port: opts.port,
                fn: opts.fn
            };
        }
        if (cb) cb(err, doc);
        return this;
    },

    ms.unregistClientType = function (opts, cb) {
        opts = opts || {};
        var err = null;
        var doc = null;
        if (!opts.type) {
            err = new Error('invalid params');
            doc = ERR.FA_PARAMS;
        } else {
            var type = opts.type.toLowerCase();
            if (regTypes[type]) {
                delete regTypes[type];
            }
        }
        if (cb) cb(err, doc);
        return this;
    },

    /**
     * 创建客户端
     * @function ms#client
     * @param {Object} opts 参数
     * @example
     * opts参数:{
     *  type: 类型(可选, 默认http)
     *  uri: uri(可选, 默认http://127.0.0.1)
     *  timeout: 请求超时(可选, 单位毫秒, 默认0表示不检测超时)
     * }
     * @param cb 回调cb(err,doc)
     * @returns {jm.ms}
     */
    ms.client = function (opts, cb) {
        opts = opts || {};
        var err = null;
        var doc = null;
        var type = null;
        if(opts.uri){
            type = ms.utils.getUriProtocol(opts.uri);
        }
        type = opts.type || type || 'http';
        type = type.toLowerCase();
        var o = regTypes[type];
        if (!o) {
            err = new Error('invalid type');
            doc = ERR.ms.FA_INVALIDTYPE;
        } else {
            o.fn.call(this, opts, function(err, doc){
                ms.utils.enableType(doc, ['get', 'post', 'put', 'delete']);
                cb(err, doc);
            });
            return this;
        }
        if (cb) cb(err, doc);
        return this;
    };

})();

var jm = jm || {};
var WebSocket = WebSocket || null;

(function () {
    'use strict';
    var MAXID = 999999;
    var defaultPort = 3100;
    var createClientImpl = null;
    if (typeof module !== 'undefined' && module.exports) {
        jm = require('jm-ms-core');
        WebSocket = require("ws");
        createClientImpl = function (uri, onmessage) {
            var ws = new WebSocket(uri);
            ws.on('message', function (data, flags) {
                // flags.binary will be set if a binary data is received.
                // flags.masked will be set if the data was masked.
                onmessage(data);
            });
            return ws;
        };
    } else {
        createClientImpl = function (uri, onmessage) {
            var ws = new WebSocket(uri);
            ws.onmessage = function (event) {
                onmessage(event.data);
            };
            return ws;
        };
    }

    var logger = jm.getLogger('jm-ms-ws:client');
    var createClient = function (opts, cb) {
        var self = this;
        opts = opts || {};
        var err = null;
        var ws = null;
        var connected = false;
        var autoReconnect = false;
        var id = 0;
        var cbs = {};

        var client = {
            request: function (opts, cb) {
                var r = ms.utils.preRequest.apply(this, arguments);
                opts = r.opts;
                cb = r.cb;
                if(!connected) return cb(new Error(jm.ERR.FA_NETWORK.msg), jm.ERR.FA_NETWORK);
                opts.uri = prefix + (opts.uri || '');
                if (cb) {
                    if(id >= MAXID) id = 0;
                    id++;
                    cbs[id] = cb;
                    opts.id = id;
                }
                ws.send(JSON.stringify(opts));
            },

            close: function() {
                autoReconnect = false;
                ws.close();
                ws = null;
            }
        };
        jm.enableEvent(client);

        var onmessage = function(message) {
            logger.debug('received: %s', message);
            client.emit('message', message);
            var json = null;
            try {
                json = JSON.parse(message);
            }
            catch (err) {
                return;
            }
            if (json.id) {
                if (cbs[json.id]) {
                    var err = null;
                    var doc = json.data;
                    if (doc.err) {
                        err = new Error(doc.msg);
                    }
                    cbs[json.id](err, doc);
                    delete cbs[json.id];
                }
            }
        };

        var uri = opts.uri || 'ws://127.0.0.1:' + defaultPort;
        var path = jm.ms.utils.getUriPath(uri);
        var prefix = opts.prefix || '';
        prefix = path + prefix;
        var reconnect = false;
        var reconncetTimer = null;
        var reconnectAttempts = 0;
        var reconnectionDelay = opts.reconnectionDelay || 5000;
        var DEFAULT_MAX_RECONNECT_ATTEMPTS = 0; //默认重试次数0 表示无限制
        var maxReconnectAttempts = opts.maxReconnectAttempts || DEFAULT_MAX_RECONNECT_ATTEMPTS;
        client.connect = function() {
            if(connected) return;
            logger.debug('connect to ' + uri);
            var self = client;
            if(!autoReconnect && opts.reconnect){
                autoReconnect = opts.reconnect;
                reconnect = false;
                reconnectAttempts = 0;
            }
            var onopen = function(event) {
                logger.debug('connected to ' + uri);
                connected = true;
                if(!!reconnect) {
                    self.emit('reconnect');
                }
                self.emit('open');
                if(self.onopen){
                    logger.warn(
                        'Deprecated: onopen, please use on(\'open\' function(err,doc){}).'
                    );
                    self.onopen(event);
                }
            };
            var onclose = function(event) {
                connected = false;
                self.emit('close');
                if(!!autoReconnect && (!maxReconnectAttempts || reconnectAttempts < maxReconnectAttempts)) {
                    reconnect = true;
                    reconnectAttempts++;
                    reconncetTimer = setTimeout(function() {
                        self.connect();
                    }, reconnectionDelay);
                }
            };
            var onerror = function(event) {
                client.emit('error');
            };
            ws = createClientImpl(uri, onmessage);
            ws.onopen = onopen;
            ws.onerror = onerror;
            ws.onclose = onclose;
        };

        client.connect();
        if (cb) cb(err, client);
        return this;
    };

    logger = jm.getLogger('jm-ms-ws:client');
    var ms = jm.ms;
    ms.registClientType({
        type: 'ws',
        fn: createClient
    });

})();


var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-ms-core');
    require("jm-ajax");
}

(function () {
    'use strict';
    var ms = jm.ms;
    var defaultPort = 3000;

    var $ = {};
    jm.enableAjax($);

    var createClient = function(opts, cb){
        var self = this;
        opts = opts || {};
        var err = null;
        var doc = null;
        var uri = opts.uri || 'http://127.0.0.1:' + defaultPort;
        var timeout = opts.timeout || 0;

        doc = {
            request: function(opts, cb) {
                var r = ms.utils.preRequest.apply(this, arguments);
                opts = r.opts;
                cb = r.cb;
                var type = opts.type || 'get';
                $[type]({
                    url: uri + opts.uri,
                    timeout: opts.timeout || timeout,
                    data: opts.data,
                    headers: opts.headers || {}
                }, cb);
            }
        };
        jm.enableEvent(doc);

        if(cb) cb(err, doc);
        doc.emit('open');
        return this;
    };

    ms.registClientType({
        type: 'http',
        fn: createClient
    });

})();
