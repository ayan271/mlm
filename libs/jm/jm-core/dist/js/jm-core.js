var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    module.exports = jm;
}

(function(){
    if(jm.root) return;
    var root = {};
    var registries = {};
    root.registries = registries;
    jm.root = root;

})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('./root.js');
}

(function(){
    if(jm.ERR) return;
    jm.ERR = {
        SUCCESS: {
            err: 0,
            msg: 'Success'
        },

        FAIL: {
            err: 1,
            msg: 'Fail'
        },

        FA_SYS: {
            err: 2,
            msg: 'System Error'
        },

        FA_NETWORK: {
            err: 3,
            msg: 'Network Error'
        },

        FA_PARAMS: {
            err: 4,
            msg: 'Parameter Error'
        },

        FA_BUSY: {
            err: 5,
            msg: 'Busy'
        },

        FA_TIMEOUT: {
            err: 6,
            msg: 'Time Out'
        },

        FA_ABORT: {
            err: 7,
            msg: 'Abort'
        },

        FA_NOTREADY: {
            err: 8,
            msg: 'Not Ready'
        },

        OK: {
            err: 200,
            msg: 'OK'
        },

        FA_BADREQUEST: {
            err: 400,
            msg: 'Bad Request'
        },

        FA_NOAUTH: {
            err: 401,
            msg: 'Unauthorized'
        },

        FA_NOPERMISSION: {
            err: 403,
            msg: 'Forbidden'
        },

        FA_NOTFOUND: {
            err: 404,
            msg: 'Not Found'
        },

        FA_INTERNALERROR: {
            err: 500,
            msg: 'Internal Server Error'
        },

        FA_UNAVAILABLE: {
            err: 503,
            msg: 'Service Unavailable'
        }

    };

})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('./root.js');
}

(function(){
    if(jm.getLogger) return;
    if (typeof module !== 'undefined' && module.exports) {
        var log4js = require('log4js');
        jm.getLogger = function(loggerCategoryName) {
            return log4js.getLogger(loggerCategoryName);
        };
    }else{
        jm.getLogger = function(loggerCategoryName) {
            console.debug = console.debug || console.log;
            return console;
        };
    }
    jm.logger = jm.getLogger();
})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('./root.js');
}

(function () {
    if(jm.utils) return;
    jm.utils = {
        //高效slice
        slice: function (a, start, end) {
            start = start || 0;
            end = end || a.length;
            if (start < 0) start += a.length;
            if (end < 0) end += a.length;
            var r = new Array(end - start);
            for (var i = start; i < end; i++) {
                r[i - start] = a[i];
            }
            return r;
        },

        formatJSON: function(obj){
            return JSON.stringify(obj, null, 2);
        }
    };
})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('./root.js');
}

(function(){
    if(jm.aop) return;
    jm.aop = {
        _Arguments: function (args) {
            //convert arguments object to array
            this.value = [].slice.call(args);
        },

        arguments: function () {
            //convert arguments object to array
            return new this._Arguments(arguments);
        },

        inject: function( aOrgFunc, aBeforeExec, aAtferExec ) {
            var self = this;
            return function() {
                var Result, isDenied=false, args=[].slice.call(arguments);
                if (typeof(aBeforeExec) == 'function') {
                    Result = aBeforeExec.apply(this, args);
                    if (Result instanceof self._Arguments) //(Result.constructor === _Arguments)
                        args = Result.value;
                    else if (isDenied = Result !== undefined)
                        args.push(Result);
                }
                !isDenied && args.push(aOrgFunc.apply(this, args)); //if (!isDenied) args.push(aOrgFunc.apply(this, args));
                if (typeof(aAtferExec) == 'function')
                    Result = aAtferExec.apply(this, args.concat(isDenied));
                else
                    Result = undefined;
                return (Result !== undefined ? Result : args.pop());
            }
        }
    };

})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('./root.js');
}

(function(){
    if(jm.Class) return;
    var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    jm.Class = function(){};

    // Create a new Class that inherits from this class
    jm.Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        var prototype = Object.create(_super);

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            if(name == 'properties'){
                continue;
            }
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    return function() {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        {
            var properties = prop['properties'];
            for(var key in properties){
                var desc = properties[key];
                if(desc.get && typeof desc.get == "string"){
                    desc.get = prototype[desc.get];
                }
                if(desc.set && typeof desc.set == "string"){
                    desc.set = prototype[desc.set];
                }
                Object.defineProperty(prototype, key, desc);
            }
        }

        // The dummy class constructor
        function Class() {
            if(this._className){
                Object.defineProperty(this, "className", { value: this._className, writable: false });
            }

            // All construction is actually done in the init method
            if ( this.ctor )
                this.ctor.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = jm.Class.extend;

        return Class;
    };
})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('./root.js');
}

(function(){
    if(jm.Object) return;
    jm.Object = jm.Class.extend({
        _className: 'object',

        attr: function (attrs) {
            for (var key in attrs) {
                if(key === 'className'){
                    continue;
                }

                this[key] = attrs[key];
            }
        }
    });

    jm.object = function(){
        return new jm.Object();
    };
})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('./root.js');
}

(function(){
    if(jm.Random) return;
    var iRandomMax = 200000000000;    //最大随机整数范围 0 <= randomValue <= iRandomMax;

    jm.Random = jm.Class.extend({
        _className: 'random',

        properties: {
            seed: { get: 'getSeed', set: 'setSeed' }
        },

        ctor: function(opts){
            opts = opts || {};
            this.g_seed = 0;
            this.randomMax =  opts.randomMax || iRandomMax;            
        },

        setSeed : function(seed)
        {
            this.g_seed = seed;
        },

        getSeed : function()
        {
            return this.g_seed;
        },

        random : function(){
            this.g_seed = ( this.g_seed * 9301 + 49297 ) % 233280;
            return this.g_seed / ( 233280.0 );
        },

        //min<=result<=max
        randomInt : function(min, max)
        {
            if(max === undefined) {
                max = min;
                min = 0;
            }
            var range = min + (this.random()*(max - min));
            return Math.round(range);
        },

        //min<=result<=max
        randomDouble : function(min, max)
        {
            if(max === undefined) {
                max = min;
                min = 0.0;
            }

            var range = min + (this.random()*(max - min));
            return range;
        },

        randomRange : function(range){
            return this.randomInt(0,this.randomMax) % range;
        },

        randomOdds : function(range, odds){
            if(this.randomRange(range) < odds) return 1;
            return 0;
        }
    });

    jm.random = function(opts){
        return new jm.Random(opts);
    };

})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('./root.js');
}

(function(){
    if(jm.EventEmitter) return;
    jm.EventEmitter = jm.Object.extend({
        _className: 'eventEmitter',

        ctor: function () {
            this._events = {};
            this.addListener = this.on;
        },

        __createListener: function(fn, caller) {
            caller = caller;
            return {
                fn: fn,
                caller: caller
            };
        },

        __equalsListener: function (listener1, listener2) {
            return listener1.fn === listener2.fn && listener1.caller === listener2.caller;
        },

        /**
         * Adds a listener
         *
         * @api public
         */

        on: function (name, fn, caller) {
            var listener = this.__createListener(fn, caller);
            if (!this._events[name]) {
                this._events[name] = listener;
            } else if (Array.isArray(this._events[name])) {
                this._events[name].push(listener);
            } else {
                this._events[name] = [this._events[name], listener];
            }
            return this;
        },

        /**
         * Adds a volatile listener.
         *
         * @api public
         */

        once: function (name, fn, caller) {
            var self = this;
            var listener = this.__createListener(fn, caller);

            function on (arg1, arg2, arg3, arg4, arg5) {
                self.removeListener(name, on);
                fn.call(listener.caller, arg1, arg2, arg3, arg4, arg5);
            };

            on.listener = listener;
            this.on(name, on);

            return this;
        },


        /**
         * Removes a listener.
         *
         * @api public
         */

        removeListener: function (name, fn, caller) {
            var listener = this.__createListener(fn, caller);
            if (this._events && this._events[name]) {
                var list = this._events[name];

                if (Array.isArray(list)) {
                    var pos = -1;

                    for (var i = 0, l = list.length; i < l; i++) {
                        var o = list[i];
                        if (this.__equalsListener(o, listener) || (o.listener && this.__equalsListener(o.listener, listener))) {
                            pos = i;
                            break;
                        }
                    }

                    if (pos < 0) {
                        return this;
                    }

                    list.splice(pos, 1);

                    if (!list.length) {
                        delete this._events[name];
                    }
                } else if (this.__equalsListener(list, listener) || (list.listener && this.__equalsListener(list.listener, listener))) {
                    delete this._events[name];
                }
            }

            return this;
        },

        /**
         * Removes all listeners for an event.
         *
         * @api public
         */

        removeAllListeners: function (name) {
            if (name === undefined) {
                this._events = {};
                return this;
            }

            if (this._events && this._events[name]) {
                this._events[name] = null;
            }

            return this;
        },

        /**
         * Gets all listeners for a certain event.
         *
         * @api publci
         */

        listeners: function (name) {
            if (!this._events[name]) {
                this._events[name] = [];
            }

            if (!Array.isArray(this._events[name])) {
                this._events[name] = [this._events[name]];
            }

            return this._events[name];
        },

        /**
         * Emits an event.
         *
         * tip: use arg1...arg5 instead of arguments for performance consider.
         *
         * @api public
         */

        emit: function (name, arg1, arg2, arg3, arg4, arg5) {
            var handler = this._events[name];
            if (!handler) return this;

            if(typeof handler === 'object' && !Array.isArray(handler)){
                handler.fn.call(handler.caller || this, arg1, arg2, arg3, arg4, arg5);
            } else if (Array.isArray(handler)) {
                var listeners = new Array(handler.length);
                for (var i = 0; i < handler.length; i++) {
                    listeners[i] = handler[i];
                }

                for (var i = 0, l = listeners.length; i < l; i++) {
                    var h = listeners[i];
                    if(h.fn.call(h.caller || this, arg1, arg2, arg3, arg4, arg5) === false) break;
                }
            }
            return this;
        }
    });

    jm.eventEmitter = function(){ return new jm.EventEmitter();}

    var prototype = jm.EventEmitter.prototype;
    var EventEmitter = {
        _events: {},

        __createListener: prototype.__createListener,
        __equalsListener: prototype.__equalsListener,
        on: prototype.on,
        once: prototype.once,
        addListener: prototype.on,
        removeListener: prototype.removeListener,
        removeAllListeners: prototype.removeAllListeners,
        listeners: prototype.listeners,
        emit: prototype.emit
    };

    var em = EventEmitter;
    jm.enableEvent = function(obj) {
        if(obj._events!==undefined) return;
        for(var key in em){
            obj[key] = em[key];
        }
        obj._events = {};
        return this;
    };

    jm.disableEvent = function(obj) {
        for(var key in em){
            delete obj[key];
        }
        return this;
    };

})();

var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('./root.js');
}

(function(){
    if(jm.TagObject) return;
    jm.TagObject = jm.EventEmitter.extend({
        _className: 'tagObject',

        ctor: function(){
            this._super();
            this._tags = [];
            Object.defineProperty(this, "tags", { value: this._tags, writable: false });
        },

        destroy: function(){
            this.emit('destroy', this);
            this.removeAllTags();
        },

        hasTag: function(tag){
            var tags = this._tags;
            return tags.indexOf(tag) != -1;
        },

        hasTagAny: function(tags){
            for(var i in tags){
                var t = tags[i];
                if(this.hasTag(t)) return true;
            }
            return false;
        },

        hasTagAll: function(tags){
            for(var i in tags){
                var t = tags[i];
                if(!this.hasTag(t)) return false;
            }
            return true;
        },

        addTag: function(tag){
            var tags = this._tags;
            if (this.hasTag(tag)) return this;
            tags.push(tag);
            this.emit('addTag', tag);
            return this;
        },

        addTags: function(tags){
            for(var i in tags){
                var t = tags[i];
                this.addTag(t);
            }
            return this;
        },

        removeTag: function(tag){
            var tags = this._tags;
            var idx = tags.indexOf(tag);
            if(idx>=0){
                tags.splice(idx, 1);
            }
            this.emit('removeTag', tag);
            return this;
        },

        removeTags: function(tags){
            for(var i in tags){
                var t = tags[i];
                this.removeTag(t);
            }
            return this;
        },

        removeAllTags: function () {
            var v = this._tags;
            for(i in v){
                this.emit('removeTag', v[i]);
            }
            this._tags = [];
            this.emit('removeAllTags');
            return this;
        }

    });

    jm.tagObject = function(){return new jm.TagObject();}

    var prototype = jm.TagObject.prototype;
    var Tag = {
        _tags: [],

        hasTag: prototype.hasTag,
        hasTagAny: prototype.hasTagAny,
        hasTagAll: prototype.hasTagAll,
        addTag: prototype.addTag,
        addTags: prototype.addTags,
        removeTag: prototype.removeTag,
        removeTags: prototype.removeTags,
        removeAllTags: prototype.removeAllTags
    };

    jm.enableTag = function(obj) {
        if(obj._tags!=undefined) return;
        for(key in Tag){
            obj[key] = Tag[key];
        }
        obj._tags = [];
        Object.defineProperty(obj, "tags", { value: obj._tags, writable: false });
        jm.enableEvent(obj);
    };

    jm.disableTag = function(obj) {
        for(key in Tag){
            delete obj[key];
        }
        jm.disableEvent(obj);
    };
})();
