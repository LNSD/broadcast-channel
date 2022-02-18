"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["vendor"],{

/***/ 7724:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ObliviousSet": () => (/* binding */ ObliviousSet),
/* harmony export */   "removeTooOldValues": () => (/* binding */ removeTooOldValues),
/* harmony export */   "now": () => (/* binding */ now)
/* harmony export */ });
/**
 * this is a set which automatically forgets
 * a given entry when a new entry is set and the ttl
 * of the old one is over
 */
var ObliviousSet = /** @class */ (function () {
    function ObliviousSet(ttl) {
        this.ttl = ttl;
        this.set = new Set();
        this.timeMap = new Map();
    }
    ObliviousSet.prototype.has = function (value) {
        return this.set.has(value);
    };
    ObliviousSet.prototype.add = function (value) {
        var _this = this;
        this.timeMap.set(value, now());
        this.set.add(value);
        /**
         * When a new value is added,
         * start the cleanup at the next tick
         * to not block the cpu for more important stuff
         * that might happen.
         */
        setTimeout(function () {
            removeTooOldValues(_this);
        }, 0);
    };
    ObliviousSet.prototype.clear = function () {
        this.set.clear();
        this.timeMap.clear();
    };
    return ObliviousSet;
}());

/**
 * Removes all entries from the set
 * where the TTL has expired
 */
function removeTooOldValues(obliviousSet) {
    var olderThen = now() - obliviousSet.ttl;
    var iterator = obliviousSet.set[Symbol.iterator]();
    /**
     * Because we can assume the new values are added at the bottom,
     * we start from the top and stop as soon as we reach a non-too-old value.
     */
    while (true) {
        var value = iterator.next().value;
        if (!value) {
            return; // no more elements
        }
        var time = obliviousSet.timeMap.get(value);
        if (time < olderThen) {
            obliviousSet.timeMap.delete(value);
            obliviousSet.set.delete(value);
        }
        else {
            // We reached a value that is not old enough
            return;
        }
    }
}
function now() {
    return new Date().getTime();
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6715:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*! (c) Andrea Giammarchi - ISC */
var self = {};
try {
  self.EventTarget = (new EventTarget).constructor;
} catch(EventTarget) {
  (function (Object, wm) {
    var create = Object.create;
    var defineProperty = Object.defineProperty;
    var proto = EventTarget.prototype;
    define(proto, 'addEventListener', function (type, listener, options) {
      for (var
        secret = wm.get(this),
        listeners = secret[type] || (secret[type] = []),
        i = 0, length = listeners.length; i < length; i++
      ) {
        if (listeners[i].listener === listener)
          return;
      }
      listeners.push({target: this, listener: listener, options: options});
    });
    define(proto, 'dispatchEvent', function (event) {
      var secret = wm.get(this);
      var listeners = secret[event.type];
      if (listeners) {
        define(event, 'target', this);
        define(event, 'currentTarget', this);
        listeners.slice(0).some(dispatch, event);
        delete event.currentTarget;
        delete event.target;
      }
      return true;
    });
    define(proto, 'removeEventListener', function (type, listener) {
      for (var
        secret = wm.get(this),
        /* istanbul ignore next */
        listeners = secret[type] || (secret[type] = []),
        i = 0, length = listeners.length; i < length; i++
      ) {
        if (listeners[i].listener === listener) {
          listeners.splice(i, 1);
          return;
        }
      }
    });
    self.EventTarget = EventTarget;
    function EventTarget() {'use strict';
      wm.set(this, create(null));
    }
    function define(target, name, value) {
      defineProperty(
        target,
        name,
        {
          configurable: true,
          writable: true,
          value: value
        }
      );
    }
    function dispatch(info) {
      var options = info.options;
      if (options && options.once)
        info.target.removeEventListener(this.type, info.listener);
      if (typeof info.listener === 'function')
        info.listener.call(info.target, this);
      else
        info.listener.handleEvent(this);
      return this._stopImmediatePropagationFlag;
    }
  }(Object, new WeakMap));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (self.EventTarget);


/***/ }),

/***/ 9975:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deserialize": () => (/* binding */ deserialize)
/* harmony export */ });
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3431);


const env = typeof self === 'object' ? self : globalThis;

const deserializer = ($, _) => {
  const as = (out, index) => {
    $.set(index, out);
    return out;
  };

  const unpair = index => {
    if ($.has(index))
      return $.get(index);

    const [type, value] = _[index];
    switch (type) {
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.PRIMITIVE:
        return as(value, index);
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY: {
        const arr = as([], index);
        for (const index of value)
          arr.push(unpair(index));
        return arr;
      }
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.OBJECT: {
        const object = as({}, index);
        for (const [key, index] of value)
          object[unpair(key)] = unpair(index);
        return object;
      }
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.DATE:
        return as(new Date(value), index);
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.REGEXP: {
        const {source, flags} = value;
        return as(new RegExp(source, flags), index);
      }
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.MAP: {
        const map = as(new Map, index);
        for (const [key, index] of value)
          map.set(unpair(key), unpair(index));
        return map;
      }
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.SET: {
        const set = as(new Set, index);
        for (const index of value)
          set.add(unpair(index));
        return set;
      }
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.ERROR: {
        const {name, message} = value;
        return as(new env[name](message), index);
      }
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.BIGINT:
        return as(BigInt(value), index);
      case 'BigInt':
        return as(Object(BigInt(value)), index);
    }
    return as(new env[type](value), index);
  };

  return unpair;
};

/**
 * @typedef {Array<string,any>} Record a type representation
 */

/**
 * Returns a deserialized value from a serialized array of Records.
 * @param {Record[]} serialized a previously serialized value.
 * @returns {any}
 */
const deserialize = serialized => deserializer(new Map, serialized)(0);


/***/ }),

/***/ 3656:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "deserialize": () => (/* reexport safe */ _deserialize_js__WEBPACK_IMPORTED_MODULE_0__.deserialize),
/* harmony export */   "serialize": () => (/* reexport safe */ _serialize_js__WEBPACK_IMPORTED_MODULE_1__.serialize)
/* harmony export */ });
/* harmony import */ var _deserialize_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9975);
/* harmony import */ var _serialize_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8329);



/**
 * @typedef {Array<string,any>} Record a type representation
 */

/**
 * Returns an array of serialized Records.
 * @param {any} any a serializable value.
 * @param {{transfer: any[]}?} options an object with a transfoer property.
 *  This is currently not supported, all values are always cloned.
 * @returns {Record[]}
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof structuredClone === "function" ?
  structuredClone :
  (any, options) => (0,_deserialize_js__WEBPACK_IMPORTED_MODULE_0__.deserialize)((0,_serialize_js__WEBPACK_IMPORTED_MODULE_1__.serialize)(any, options)));




/***/ }),

/***/ 8329:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "serialize": () => (/* binding */ serialize)
/* harmony export */ });
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3431);


const EMPTY = '';

const {toString} = {};
const {keys} = Object;

const typeOf = value => {
  const type = typeof value;
  if (type !== 'object' || !value)
    return [_types_js__WEBPACK_IMPORTED_MODULE_0__.PRIMITIVE, type];

  const asString = toString.call(value).slice(8, -1);
  switch (asString) {
    case 'Array':
      return [_types_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY, EMPTY];
    case 'Object':
      return [_types_js__WEBPACK_IMPORTED_MODULE_0__.OBJECT, EMPTY];
    case 'Date':
      return [_types_js__WEBPACK_IMPORTED_MODULE_0__.DATE, EMPTY];
    case 'RegExp':
      return [_types_js__WEBPACK_IMPORTED_MODULE_0__.REGEXP, EMPTY];
    case 'Map':
      return [_types_js__WEBPACK_IMPORTED_MODULE_0__.MAP, EMPTY];
    case 'Set':
      return [_types_js__WEBPACK_IMPORTED_MODULE_0__.SET, EMPTY];
  }

  if (asString.includes('Array'))
    return [_types_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY, asString];

  if (asString.includes('Error'))
    return [_types_js__WEBPACK_IMPORTED_MODULE_0__.ERROR, asString];

  return [_types_js__WEBPACK_IMPORTED_MODULE_0__.OBJECT, asString];
};

const shouldSkip = ([TYPE, type]) => (
  TYPE === _types_js__WEBPACK_IMPORTED_MODULE_0__.PRIMITIVE &&
  (type === 'function' || type === 'symbol')
);

const serializer = (strict, json, $, _) => {

  const as = (out, value) => {
    const index = _.push(out) - 1;
    $.set(value, index);
    return index;
  };

  const pair = value => {
    if ($.has(value))
      return $.get(value);

    let [TYPE, type] = typeOf(value);
    switch (TYPE) {
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.PRIMITIVE: {
        let entry = value;
        switch (type) {
          case 'bigint':
            TYPE = _types_js__WEBPACK_IMPORTED_MODULE_0__.BIGINT;
            entry = value.toString();
            break;
          case 'function':
          case 'symbol':
            if (strict)
              throw new TypeError('unable to serialize ' + type);
            entry = null;
            break;
        }
        return as([TYPE, entry], value);
      }
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY: {
        if (type)
          return as([type, [...value]], value);
  
        const arr = [];
        const index = as([TYPE, arr], value);
        for (const entry of value)
          arr.push(pair(entry));
        return index;
      }
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.OBJECT: {
        if (type) {
          switch (type) {
            case 'BigInt':
              return as([type, value.toString()], value);
            case 'Boolean':
            case 'Number':
            case 'String':
              return as([type, value.valueOf()], value);
          }
        }

        if (json && ('toJSON' in value))
          return pair(value.toJSON());

        const entries = [];
        const index = as([TYPE, entries], value);
        for (const key of keys(value)) {
          if (strict || !shouldSkip(typeOf(value[key])))
            entries.push([pair(key), pair(value[key])]);
        }
        return index;
      }
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.DATE:
        return as([TYPE, value.toISOString()], value);
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.REGEXP: {
        const {source, flags} = value;
        return as([TYPE, {source, flags}], value);
      }
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.MAP: {
        const entries = [];
        const index = as([TYPE, entries], value);
        for (const [key, entry] of value) {
          if (strict || !(shouldSkip(typeOf(key)) || shouldSkip(typeOf(entry))))
            entries.push([pair(key), pair(entry)]);
        }
        return index;
      }
      case _types_js__WEBPACK_IMPORTED_MODULE_0__.SET: {
        const entries = [];
        const index = as([TYPE, entries], value);
        for (const entry of value) {
          if (strict || !shouldSkip(typeOf(entry)))
            entries.push(pair(entry));
        }
        return index;
      }
    }

    const {message} = value;
    return as([TYPE, {name: type, message}], value);
  };

  return pair;
};

/**
 * @typedef {Array<string,any>} Record a type representation
 */

/**
 * Returns an array of serialized Records.
 * @param {any} value a serializable value.
 * @param {{lossy?: boolean}?} options an object with a `lossy` property that,
 *  if `true`, will not throw errors on incompatible types, and behave more
 *  like JSON stringify would behave. Symbol and Function will be discarded.
 * @returns {Record[]}
 */
 const serialize = (value, {json, lossy} = {}) => {
  const _ = [];
  return serializer(!(json || lossy), !!json, new Map, _)(value), _;
};


/***/ }),

/***/ 3431:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PRIMITIVE": () => (/* binding */ PRIMITIVE),
/* harmony export */   "ARRAY": () => (/* binding */ ARRAY),
/* harmony export */   "OBJECT": () => (/* binding */ OBJECT),
/* harmony export */   "DATE": () => (/* binding */ DATE),
/* harmony export */   "REGEXP": () => (/* binding */ REGEXP),
/* harmony export */   "MAP": () => (/* binding */ MAP),
/* harmony export */   "SET": () => (/* binding */ SET),
/* harmony export */   "ERROR": () => (/* binding */ ERROR),
/* harmony export */   "BIGINT": () => (/* binding */ BIGINT)
/* harmony export */ });
const PRIMITIVE  = 0;
const ARRAY      = 1;
const OBJECT     = 2;
const DATE       = 3;
const REGEXP     = 4;
const MAP        = 5;
const SET        = 6;
const ERROR      = 7;
const BIGINT     = 8;
// export const SYMBOL = 9;


/***/ })

}]);
//# sourceMappingURL=vendor.js.map