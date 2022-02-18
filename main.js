"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["main"],{

/***/ 3151:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lnsd_broadcast_channel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(466);

const channel = new _lnsd_broadcast_channel__WEBPACK_IMPORTED_MODULE_0__["default"]('demo');

channel.onmessage = function (message) {
  displayReceivedMessage(message.data);
};

const messageInput = document.getElementById('message-input');
const submitButton = document.getElementById('submit-button');
const messagesBox = document.getElementById('messages');

messageInput.onkeyup = function (event) {
  const message = messageInput.value;

  if (message !== '' && event.key === 'Enter') {
    postMessage(message);
    clearMessageInput();
    disableSubmitButton();
    return;
  }

  if (message === '') {
    disableSubmitButton();
  } else {
    enableSubmitButton();
  }
};

submitButton.onclick = function () {
  const message = messageInput.value;

  if (message === '') {
    return;
  }

  postMessage(message);
  clearMessageInput();
  disableSubmitButton();
};

function postMessage(message) {
  if (message === '') {
    return;
  }

  channel.postMessage(message);
  displayEmittedMessage(message);
}

function disableSubmitButton() {
  submitButton.classList.add('is-disabled');
}

function enableSubmitButton() {
  submitButton.classList.remove('is-disabled');
}

function clearMessageInput() {
  messageInput.value = '';
}

function messageBalloon(message, side) {
  const section = document.createElement('div');
  section.classList.add('message');
  section.classList.add(`-${side}`);
  const balloon = document.createElement('div');
  balloon.classList.add('nes-balloon');
  balloon.classList.add(`from-${side}`);
  const messageContainer = document.createElement('p');
  const text = document.createTextNode(message);
  section.appendChild(balloon);
  balloon.appendChild(messageContainer);
  messageContainer.appendChild(text);
  return section;
}

function displayEmittedMessage(message) {
  const balloon = messageBalloon(message, 'left');
  messagesBox.appendChild(balloon);
}

function displayReceivedMessage(message) {
  const balloon = messageBalloon(message, 'right');
  messagesBox.appendChild(balloon);
}

/***/ }),

/***/ 466:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NativeChannel": () => (/* reexport safe */ _lib_channel__WEBPACK_IMPORTED_MODULE_1__.NativeChannel),
/* harmony export */   "LocalStorageChannel": () => (/* reexport safe */ _lib_channel__WEBPACK_IMPORTED_MODULE_1__.LocalStorageChannel),
/* harmony export */   "FakeChannel": () => (/* reexport safe */ _lib_channel__WEBPACK_IMPORTED_MODULE_1__.FakeChannel),
/* harmony export */   "messageEvent": () => (/* reexport safe */ _lib_channel__WEBPACK_IMPORTED_MODULE_1__.messageEvent),
/* harmony export */   "messageErrorEvent": () => (/* reexport safe */ _lib_channel__WEBPACK_IMPORTED_MODULE_1__.messageErrorEvent),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_broadcast_channel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5151);
/* harmony import */ var _lib_channel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3479);


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_lib_broadcast_channel__WEBPACK_IMPORTED_MODULE_0__.BroadcastChannelInstance);

/***/ }),

/***/ 5151:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BroadcastChannelInstance": () => (/* binding */ BroadcastChannelInstance)
/* harmony export */ });
/* harmony import */ var _ungap_event_target__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6715);
/* harmony import */ var _channel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3479);



function channel(name, options) {
  const channelFactory = options?.backend ?? (0,_channel__WEBPACK_IMPORTED_MODULE_1__.getOptimalChannel)(..._channel__WEBPACK_IMPORTED_MODULE_1__.defaultChannelsList);

  if (channelFactory === null) {
    throw new Error('BroadcastChannel cannot be used. Not supported');
  } // Get channel specific options


  const channelOptions = options?.options?.[channelFactory.optionsKey]; // Create backend channel instance

  return channelFactory.getChannel(name, channelOptions);
}

class BroadcastChannelInstance {
  emitter = new _ungap_event_target__WEBPACK_IMPORTED_MODULE_0__["default"]();
  addEventListener = this.emitter.addEventListener.bind(this);
  removeEventListener = this.emitter.removeEventListener.bind(this);
  dispatchEvent = this.emitter.dispatchEvent.bind(this);

  constructor(name, options) {
    this.name = name;
    this.channel = channel(name, options);
    this.channel.onmessage(ev => {
      this._onmessage?.(ev);
      this.emitter.dispatchEvent(ev);
    });
    this.channel.onmessageerror(ev => {
      this._onmessageerror?.(ev);
      this.emitter.dispatchEvent(ev);
    });
  }

  _onmessage = null;

  get onmessage() {
    return this._onmessage;
  }

  set onmessage(listener) {
    if (!listener) {
      return;
    }

    this._onmessage = listener;
  }

  _onmessageerror = null;

  get onmessageerror() {
    return this._onmessageerror;
  }

  set onmessageerror(listener) {
    if (!listener) {
      return;
    }

    this._onmessageerror = listener;
  }

  close() {
    if (this.channel === null) {
      return;
    }

    this.channel.close();
    this.channel = null;
  }

  postMessage(message) {
    if (this.channel === null) {
      throw new DOMException('Already closed', 'InvalidStateError');
    }

    this.channel.postMessage(message);
  }

}

/***/ }),

/***/ 8317:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "resetFakeChannel": () => (/* binding */ resetFakeChannel),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3192);
/* harmony import */ var _ungap_structured_clone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3656);
/* harmony import */ var _message_event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9122);


 // Fixture management

const fakeChannels = new Map();
function resetFakeChannel() {
  fakeChannels.clear();
} // Channel

class FakeChannel {
  uuid = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.uuidv4)();
  _onmessage = null;
  _onmessageerror = null;
  closed = false;

  constructor(name) {
    this.name = name;
  }

  onmessage(listener) {
    this._onmessage = ev => {
      listener(new MessageEvent('message', {
        data: (0,_ungap_structured_clone__WEBPACK_IMPORTED_MODULE_1__.deserialize)(ev.data)
      }));
    };
  }

  onmessageerror(listener) {
    this._onmessageerror = listener;
  }

  close() {
    if (this.closed) {
      return;
    }

    const listeners = fakeChannels.get(this.name);

    if (listeners === undefined) {
      return;
    }

    listeners.delete(this);

    if (listeners.size === 0) {
      fakeChannels.delete(this.name);
    }

    this.closed = true;
  }

  postMessage(message) {
    if (this.closed) {
      return;
    } // Data serialization


    let data;

    try {
      data = (0,_ungap_structured_clone__WEBPACK_IMPORTED_MODULE_1__.serialize)(message);
    } catch (err) {
      this.dispatchMessageError(new DOMException(`Uncloneable value: ${err.message}`, 'DataCloneError'));
      return;
    }

    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.defer)(() => this.dispatchMessage(data));
  }

  dispatchMessage(data) {
    const listeners = fakeChannels.get(this.name);

    if (listeners === undefined) {
      return;
    }

    for (const channel of listeners) {
      if (channel === this) {
        continue;
      }

      if (channel._onmessage !== null) {
        channel._onmessage((0,_message_event__WEBPACK_IMPORTED_MODULE_2__.messageEvent)(data));
      }
    }
  }

  dispatchMessageError(err) {
    if (this._onmessageerror === null) {
      return;
    }

    this._onmessageerror((0,_message_event__WEBPACK_IMPORTED_MODULE_2__.messageErrorEvent)(err));
  }

} // Factory


const factory = {
  optionsKey: 'fake',

  getChannel(name) {
    const channel = new FakeChannel(name);
    let listeners = fakeChannels.get(name);

    if (listeners === undefined) {
      listeners = new Set();
    }

    listeners.add(channel);
    fakeChannels.set(name, listeners);
    return channel;
  },

  canBeUsed() {
    return true;
  }

};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (factory);

/***/ }),

/***/ 3479:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NativeChannel": () => (/* reexport safe */ _native__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "LocalStorageChannel": () => (/* reexport safe */ _localstorage__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "FakeChannel": () => (/* reexport safe */ _fake__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "defaultChannelsList": () => (/* binding */ defaultChannelsList),
/* harmony export */   "getOptimalChannel": () => (/* binding */ getOptimalChannel),
/* harmony export */   "messageEvent": () => (/* reexport safe */ _message_event__WEBPACK_IMPORTED_MODULE_3__.messageEvent),
/* harmony export */   "messageErrorEvent": () => (/* reexport safe */ _message_event__WEBPACK_IMPORTED_MODULE_3__.messageErrorEvent)
/* harmony export */ });
/* harmony import */ var _native__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3191);
/* harmony import */ var _localstorage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1438);
/* harmony import */ var _fake__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8317);
/* harmony import */ var _message_event__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9122);




const defaultChannelsList = [_native__WEBPACK_IMPORTED_MODULE_0__["default"], _localstorage__WEBPACK_IMPORTED_MODULE_1__["default"]];

function getOptimalChannel(...channels) {
  const factory = channels.find(channelFactory => channelFactory.canBeUsed());

  if (factory === undefined) {
    return null;
  }

  return factory;
}



/***/ }),

/***/ 1438:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaultOptions": () => (/* binding */ defaultOptions),
/* harmony export */   "resetLocalStorage": () => (/* binding */ resetLocalStorage),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3192);
/* harmony import */ var oblivious_set__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7724);
/* harmony import */ var _ungap_structured_clone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3656);
/* harmony import */ var _message_event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9122);
/**
 * A localStorage-only method which uses localstorage and its 'storage'-event
 * This does not work inside of webworkers because they have no access to locastorage
 * This is basically implemented to support IE9 or your grandmothers toaster.
 * @link https://caniuse.com/#feat=namevalue-storage
 * @link https://caniuse.com/#feat=indexeddb
 */



 // Options

const defaultOptions = {
  removeTimeout: 60 * 1000
}; // LocalStorage

function getLocalStorage() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  let localStorage;

  try {
    localStorage = window.localStorage;
  } catch (e) {// New versions of Firefox throw a Security exception
    // if cookies are disabled. See
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1028153
  }

  return localStorage;
}

function storageEventListener(key, listener) {
  return ev => {
    if (ev.key !== key || ev.newValue === null) {
      return;
    }

    listener(JSON.parse(ev.newValue));
  };
}

function addStorageEventListener(listener) {
  window.addEventListener('storage', listener);
}

function removeStorageEventListener(listener) {
  window.removeEventListener('storage', listener);
}

function resetLocalStorage() {
  const localStorage = getLocalStorage();

  if (localStorage === undefined) {
    throw new Error('BroadcastChannel: LocalStorage is not available');
  } // Remove all BroadcastChannel entries


  Object.keys(localStorage).filter(key => key.startsWith(KEY_PREFIX)).forEach(key => localStorage.removeItem(key));
} // Channel

const KEY_PREFIX = 'lnsd/broadcast-channel-';

class LocalStorage {
  uuid = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.uuidv4)();
  closed = false;
  /**
   * Contains all messages that have been emitted before
   */

  _onmessage = null;
  _onmessageerror = null;

  constructor(name, options) {
    this.name = name;
    const localStorage = getLocalStorage();

    if (localStorage === undefined) {
      throw new Error('BroadcastChannel: LocalStorage not available');
    }

    const channelOptions = Object.assign({}, defaultOptions, options);
    this.emittedMessagesIds = new oblivious_set__WEBPACK_IMPORTED_MODULE_3__.ObliviousSet(channelOptions.removeTimeout);
    this.storageListener = storageEventListener(this.storageKey, ({
      senderId,
      token,
      data
    }) => {
      // No listener
      if (this._onmessage === null) {
        return;
      } // Own message


      if (senderId === this.uuid) {
        return;
      } // Already emitted


      if (this.emittedMessagesIds.has(token)) {
        return;
      }

      this.emittedMessagesIds.add(token);

      this._onmessage((0,_message_event__WEBPACK_IMPORTED_MODULE_2__.messageEvent)(data));
    });
    addStorageEventListener(this.storageListener);
  }

  get storageKey() {
    return KEY_PREFIX + this.name;
  }

  onmessage(listener) {
    this._onmessage = ev => listener((0,_message_event__WEBPACK_IMPORTED_MODULE_2__.messageEvent)((0,_ungap_structured_clone__WEBPACK_IMPORTED_MODULE_1__.deserialize)(ev.data)));
  }

  onmessageerror(listener) {
    this._onmessageerror = listener;
  }

  close() {
    if (this.closed) {
      return;
    }

    removeStorageEventListener(this.storageListener);
    this.closed = true;
  }
  /**
   * Writes the new message to the storage and fires the storage-event
   * so other readers can find it.
   */


  postMessage(message) {
    if (this.closed) {
      return;
    }

    const localStorage = getLocalStorage();

    if (localStorage === undefined) {
      return;
    } // Data serialization


    let data;

    try {
      data = (0,_ungap_structured_clone__WEBPACK_IMPORTED_MODULE_1__.serialize)(message);
    } catch (err) {
      this.dispatchMessageError(new DOMException(`Uncloneable value: ${err.message}`, 'DataCloneError'));
      return;
    }

    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.defer)(() => this.dispatchMessage(data));
  }

  dispatchMessage(data) {
    const key = this.storageKey;
    const writeObj = {
      token: (0,_utils__WEBPACK_IMPORTED_MODULE_0__.uuidv4)(),
      senderId: this.uuid,
      data: data
    };
    const newValue = JSON.stringify(writeObj);
    localStorage.setItem(key, newValue);
    /**
     * StorageEvent does not fire the 'storage' event in the window that
     * changes the state of the local storage. So we fire it manually.
     */

    window.dispatchEvent(new StorageEvent('storage', {
      key,
      newValue
    }));
  }

  dispatchMessageError(err) {
    if (this._onmessageerror === null) {
      return;
    }

    this._onmessageerror((0,_message_event__WEBPACK_IMPORTED_MODULE_2__.messageErrorEvent)(err));
  }

} // Factory


const factory = {
  optionsKey: 'localstorage',

  getChannel(name, options) {
    return new LocalStorage(name, options);
  },

  canBeUsed() {
    const localstorage = getLocalStorage();

    if (localstorage === undefined) {
      return false;
    }

    try {
      const key = '__broadcastchannel_check';
      localstorage.setItem(key, 'works');
      localstorage.removeItem(key);
    } catch (e) {
      // Safari 10 in private mode will not allow write access to local storage o
      // and fail with a QuotaExceededError. See:
      // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API#Private_Browsing_Incognito_modes
      return false;
    }

    return true;
  }

};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (factory);

/***/ }),

/***/ 9122:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "messageEvent": () => (/* binding */ messageEvent),
/* harmony export */   "messageErrorEvent": () => (/* binding */ messageErrorEvent)
/* harmony export */ });
const messageEvent = data => new MessageEvent('message', {
  data
});
const messageErrorEvent = error => new MessageEvent('messageerror', {
  cancelable: false,
  data: error
});

/***/ }),

/***/ 3191:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Channel
class NativeChannel {
  constructor(name) {
    this.channel = new BroadcastChannel(name);
  }

  onmessage(cb) {
    this.channel.onmessage = cb;
  }

  onmessageerror(cb) {
    this.channel.onmessageerror = cb;
  }

  close() {
    this.channel.close();
  }

  postMessage(message) {
    this.channel.postMessage(message);
  }

} // Factory


const factory = {
  optionsKey: 'native',

  getChannel(name) {
    return new NativeChannel(name);
  },

  canBeUsed() {
    return typeof BroadcastChannel === 'function';
  }

};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (factory);

/***/ }),

/***/ 3192:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "uuidv4": () => (/* binding */ uuidv4),
/* harmony export */   "defer": () => (/* binding */ defer)
/* harmony export */ });
/**
 * Copied from: https://stackoverflow.com/a/68141099/1099999
 */
function uuidv4() {
  return '00-0-4-1-000'.replace(/[^-]/g, s => ((Math.random() + ~~s) * 0x10000 >> s).toString(16).padStart(4, '0'));
}
/**
 * Queue a new task in the event loop after the delay and let the thread deal with it as soon
 * as it's available for more work.
 *
 * See {@link https://stackoverflow.com/questions/9083594/call-settimeout-without-delay}
 *
 * @param fn - Task to defer
 */
// eslint-disable-next-line @typescript-eslint/ban-types

function defer(fn) {
  setTimeout(fn, 0);
}

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(3151)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map