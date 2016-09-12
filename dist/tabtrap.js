'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * --------------------------------------------------------------------------
 * Tabtrap (v1.1.4): tabtrap.js
 * by Evan Yamanishi
 * Licensed under GPL-3.0
 * --------------------------------------------------------------------------
 */

var Tabtrap = function ($) {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME = 'tabtrap';
    var VERSION = '1.1.4';
    var DATA_KEY = 'a11y.tabtrap';
    var EVENT_KEY = '.' + DATA_KEY;
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var ESCAPE_KEYCODE = 27;
    var TAB_KEYCODE = 9;

    var Default = {
        disableOnEscape: false,
        tabbableElements: ['a[href]:not([tabindex="-1"])',
        // area must be descendant of a named map
        'map[name] area[href]:not([tabindex="-1"])', 'input:not([disabled]):not([tabindex="-1"])', 'select:not([disabled]):not([tabindex="-1"])', 'textarea:not([disabled]):not([tabindex="-1"])', 'button:not([disabled]):not([tabindex="-1"])', 'iframe:not([tabindex="-1"])', 'object:not([tabindex="-1"])', 'embed:not([tabindex="-1"])', '[tabindex]:not([tabindex="-1"])', '[contentEditable=true]:not([tabindex="-1"])'].join(',')
    };

    var DefaultType = {
        disableOnEscape: 'boolean',
        tabbableElements: 'string'
    };

    var Event = {
        KEYDOWN_DISABLE: 'keydown.disable' + EVENT_KEY,
        KEYDOWN_TAB: 'keydown.tab' + EVENT_KEY,
        TAB_PRESS: 'tab' + EVENT_KEY
    };

    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Tabtrap = function () {
        function Tabtrap(element, config) {
            _classCallCheck(this, Tabtrap);

            this._isEnabled = true;
            this._element = element;
            this._jQueryUI = typeof $.ui === 'undefined' ? false : true;
            this._config = this._getConfig(config);
            this._$tabbable = this._getTabbable();

            this._manageFocus();
            this._setEscapeEvent();
        }

        // getters

        _createClass(Tabtrap, [{
            key: 'enable',


            // public

            value: function enable() {
                this._isEnabled = true;
            }
        }, {
            key: 'disable',
            value: function disable() {
                this._isEnabled = false;
            }
        }, {
            key: 'toggle',
            value: function toggle() {
                this._isEnabled = !this._isEnabled;
            }
        }, {
            key: 'dispose',
            value: function dispose() {
                $.removeData(this._element, DATA_KEY);

                $(document).off(EVENT_KEY);

                this._isEnabled = null;
                this._element = null;
                this._jQueryUI = null;
                this._config = null;
                this._$tabbable = null;
            }

            // private

        }, {
            key: '_getConfig',
            value: function _getConfig(config) {
                return $.extend({}, this.constructor.Default, $(this._element).data(), config);
            }
        }, {
            key: '_getTabbable',
            value: function _getTabbable() {
                return this._jQueryUI ? $(this._element).find(':tabbable') : $(this._element).find(this._config.tabbableElements);
            }
        }, {
            key: '_manageFocus',
            value: function _manageFocus() {
                var _this = this;

                $(this._element).off(Event.KEYDOWN_TAB).on(Event.KEYDOWN_TAB, function (event) {
                    if (!_this._isEnabled && !$(_this._element).is(':visible')) return true;
                    if (event.which === TAB_KEYCODE) {
                        $(document).trigger(Event.TAB_PRESS);
                        var tabIndex = _this._$tabbable.index(event.target);
                        var conditions = {
                            outside: tabIndex < 0,
                            wrapForward: tabIndex === _this._$tabbable.length - 1 && !event.shiftKey,
                            wrapBackward: tabIndex === 0 && event.shiftKey
                        };
                        if (conditions.outside || conditions.wrapForward) {
                            event.preventDefault();
                            _this._$tabbable.first().focus();
                        }
                        if (conditions.wrapBackward) {
                            event.preventDefault();
                            _this._$tabbable.last().focus();
                        }
                    }
                });
            }
        }, {
            key: '_setEscapeEvent',
            value: function _setEscapeEvent() {
                var _this2 = this;

                if (this._config.disableOnEscape && $(this._element).is(':visible')) {
                    $(this._element).on(Event.KEYDOWN_DISABLE, function (event) {
                        if (event.which === ESCAPE_KEYCODE) {
                            _this2.disable();
                        }
                    });
                }
            }

            // static

        }], [{
            key: '_jQueryInterface',
            value: function _jQueryInterface(config) {
                return this.each(function () {
                    var data = $(this).data(DATA_KEY);
                    var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' ? config : null;

                    if (!data && /destroy|hide/.test(config)) {
                        return;
                    }

                    if (!data) {
                        data = new Tabtrap(this, _config);
                        $(this).data(DATA_KEY, data);
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
            key: 'VERSION',
            get: function get() {
                return VERSION;
            }
        }, {
            key: 'Default',
            get: function get() {
                return Default;
            }
        }, {
            key: 'NAME',
            get: function get() {
                return NAME;
            }
        }, {
            key: 'DATA_KEY',
            get: function get() {
                return DATA_KEY;
            }
        }, {
            key: 'Event',
            get: function get() {
                return Event;
            }
        }, {
            key: 'EVENT_KEY',
            get: function get() {
                return EVENT_KEY;
            }
        }, {
            key: 'DefaultType',
            get: function get() {
                return DefaultType;
            }
        }]);

        return Tabtrap;
    }();

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn[NAME] = Tabtrap._jQueryInterface;
    $.fn[NAME].Constructor = Tabtrap;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return Tabtrap._jQueryInterface;
    };

    return Tabtrap;
}(jQuery);

exports.default = Tabtrap;