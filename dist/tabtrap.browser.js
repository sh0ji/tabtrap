(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tabtrap = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * --------------------------------------------------------------------------
 * Tabtrap (v1.2.3): tabtrap.js
 * by Evan Yamanishi
 * Licensed under GPL-3.0
 * --------------------------------------------------------------------------
 */

/* CONSTANTS */

var NAME = 'tabtrap';
var VERSION = '1.2.3';
var DATA_KEY = 'tabtrap';

var KEYCODE = {
    ESCAPE: 27,
    TAB: 9
};

var Default = {
    disableOnEscape: false,
    tabbableElements: ['a[href]:not([tabindex="-1"])', 'map[name] area[href]:not([tabindex="-1"])', 'input:not([disabled]):not([tabindex="-1"])', 'select:not([disabled]):not([tabindex="-1"])', 'textarea:not([disabled]):not([tabindex="-1"])', 'button:not([disabled]):not([tabindex="-1"])', 'iframe:not([tabindex="-1"])', 'object:not([tabindex="-1"])', 'embed:not([tabindex="-1"])', '[tabindex]:not([tabindex="-1"])', '[contentEditable=true]:not([tabindex="-1"])']
};

var DefaultType = {
    disableOnEscape: 'boolean',
    tabbableElements: 'object'
};

var Event = {
    KEYDOWN_DISABLE: 'keydown.disable.' + DATA_KEY,
    KEYDOWN_TAB: 'keydown.tab.' + DATA_KEY
};

var jQueryAvailable = window.jQuery !== undefined;

/* CLASS DEFINITION */

var Tabtrap = function () {
    function Tabtrap(element, config) {
        _classCallCheck(this, Tabtrap);

        this.config = this._getConfig(element, config);
        this.element = this.config.element;
        this.enabled = true;
        this.tabbable = this._getTabbable();

        this._createEventListener();
        if (this.config.disableOnEscape) this._setEscapeEvent();
    }

    // getters

    _createClass(Tabtrap, [{
        key: 'enable',


        // public

        value: function enable() {
            this.enabled = true;
        }
    }, {
        key: 'disable',
        value: function disable() {
            this.enabled = false;
        }
    }, {
        key: 'toggle',
        value: function toggle() {
            this.enabled = !this.enabled;
        }

        // private

    }, {
        key: '_getElement',
        value: function _getElement(selector) {
            switch (typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) {
                case 'string':
                    return document.querySelectorAll(selector);
                    break;
                case 'object':
                    return selector.nodeType === 1 ? selector : this._getGalleryElements(selector.selector);
                    break;
                default:
                    throw new Error('Must provide a selector');
            }
        }
    }, {
        key: '_getConfig',
        value: function _getConfig(selector, config) {
            var _config = {};
            if ((typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) === 'object' && selector.nodeType === undefined) {
                _config = selector;
            } else {
                _config.element = this._getElement(selector);
            }
            return Object.assign({}, this.constructor.Default, _config);
        }
    }, {
        key: '_getTabbable',
        value: function _getTabbable() {
            return this.element.querySelectorAll(this.config.tabbableElements.join(','));
        }
    }, {
        key: '_getKeyCode',
        value: function _getKeyCode(event) {
            return event.which || event.keyCode || 0;
        }
    }, {
        key: '_createEventListener',
        value: function _createEventListener() {
            var _this = this;

            if (jQueryAvailable) {
                jQuery(this.element).off(Event.KEYDOWN_TAB);
                jQuery(this.element).on(Event.KEYDOWN_TAB, function (e) {
                    return _this._manageFocus(e);
                });
            } else {
                this.element.addEventListener('keydown', function (e) {
                    return _this._manageFocus(e);
                });
            }
        }
    }, {
        key: '_manageFocus',
        value: function _manageFocus(e) {
            if (this._getKeyCode(e) === KEYCODE.TAB && this.enabled) {
                var tabIndex = Array.from(this.tabbable).indexOf(e.target);
                var condition = {
                    outside: tabIndex < 0,
                    wrapForward: tabIndex === this.tabbable.length - 1 && !e.shiftKey,
                    wrapBackward: tabIndex === 0 && e.shiftKey
                };
                if (condition.outside || condition.wrapForward) {
                    e.preventDefault();
                    this.tabbable[0].focus();
                }
                if (condition.wrapBackward) {
                    e.preventDefault();
                    this.tabbable[this.tabbable.length - 1].focus();
                }
            }
        }
    }, {
        key: '_setEscapeEvent',
        value: function _setEscapeEvent() {
            var _this2 = this;

            this.element.addEventListener(Event.KEYDOWN_DISABLE, function (e) {
                if (_this2._getKeyCode(e) === KEYCODE.ESCAPE) {
                    _this2.disable();
                }
            });
        }

        // static

    }], [{
        key: '_jQueryInterface',
        value: function _jQueryInterface(config) {
            return this.each(function () {
                var data = jQuery(this).data(DATA_KEY);
                var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' ? config : null;

                if (!data && /disable/.test(config)) {
                    return;
                }

                if (!data) {
                    data = new Tabtrap(this, _config);
                    jQuery(this).data(DATA_KEY, data);
                }

                if (typeof config === 'string') {
                    if (data[config] === undefined) {
                        throw new Error('No method named "' + config + '"');
                    }
                    data[config]();
                }
            });
        }
    }, {
        key: 'trap',
        value: function trap(element, config) {
            return new Tabtrap(element, config);
        }
    }, {
        key: 'NAME',
        get: function get() {
            return NAME;
        }
    }, {
        key: 'VERSION',
        get: function get() {
            return VERSION;
        }
    }, {
        key: 'DATA_KEY',
        get: function get() {
            return DATA_KEY;
        }
    }, {
        key: 'KEYCODE',
        get: function get() {
            return KEYCODE;
        }
    }, {
        key: 'Default',
        get: function get() {
            return Default;
        }
    }, {
        key: 'DefaultType',
        get: function get() {
            return DefaultType;
        }
    }, {
        key: 'Event',
        get: function get() {
            return Event;
        }
    }, {
        key: 'jQueryAvailable',
        get: function get() {
            return jQueryAvailable;
        }
    }]);

    return Tabtrap;
}();

/* JQUERY INTERFACE INITIALIZATION */

if (jQueryAvailable) {
    (function () {
        var JQUERY_NO_CONFLICT = jQuery.fn[NAME];
        jQuery.fn[NAME] = Tabtrap._jQueryInterface;
        jQuery.fn[NAME].Constructor = Tabtrap;
        jQuery.fn[NAME].noConflict = function () {
            jQuery.fn[NAME] = JQUERY_NO_CONFLICT;
            return Tabtrap._jQueryInterface;
        };
    })();
}

exports.default = Tabtrap;
module.exports = exports['default'];

},{}]},{},[1])(1)
});