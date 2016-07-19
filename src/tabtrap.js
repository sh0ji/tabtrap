/**
 * --------------------------------------------------------------------------
 * Tabtrap (v1.1.1): tabtrap.js
 * by Evan Yamanishi
 * Licensed under GPL-3.0
 * --------------------------------------------------------------------------
 */

const Tabtrap = (($) => {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    const NAME = 'tabtrap'
    const VERSION = '1.1.1'
    const DATA_KEY = 'a11y.tabtrap'
    const EVENT_KEY = `.${DATA_KEY}`
    const JQUERY_NO_CONFLICT = $.fn[NAME]
    const ESCAPE_KEYCODE = 27
    const TAB_KEYCODE = 9

    const Default = {
        disableOnEscape: false,
        tabbableElements: 'a[href]:not([tabindex="-1"]), map[name] area[href]:not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), iframe:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"]), [contentEditable=true]:not([tabindex="-1"])'
    }

    const DefaultType = {
        jQueryUI: 'boolean',
        disableOnEscape: 'boolean',
        tabbableElements: 'string'
    }

    const Event = {
        KEYDOWN_DISABLE : `keydown.disable${EVENT_KEY}`,
        KEYDOWN_TAB     : `keydown.tab${EVENT_KEY}`,
        TAB_PRESS       : `tab${EVENT_KEY}`
    }


    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class Tabtrap {

        constructor(element, config) {
            this._isEnabled = true
            this._element   = element
            this._jQueryUI  = (typeof $.ui === 'undefined') ? false : true
            this._config    = this._getConfig(config)
            this._$tabbable = this._getTabbable()

            this._manageFocus()
            this._setEscapeEvent()
        }


        // getters

        static get VERSION() {
            return VERSION
        }

        static get Default() {
            return Default
        }

        static get NAME() {
            return NAME
        }

        static get DATA_KEY() {
            return DATA_KEY
        }

        static get Event() {
            return Event
        }

        static get EVENT_KEY() {
            return EVENT_KEY
        }

        static get DefaultType() {
            return DefaultType
        }


        // public

        enable() {
            this._isEnabled = true
        }

        disable() {
            this._isEnabled = false
        }

        toggle() {
            this._isEnabled = !this._isEnabled
        }

        dispose() {
            $.removeData(this._element, DATA_KEY)

            $(document).off(EVENT_KEY)

            this._isEnabled = null
            this._element   = null
            this._jQueryUI  = null
            this._config    = null
            this._$tabbable = null
        }


        // private

        _getConfig(config) {
            return $.extend({},
                this.constructor.Default,
                $(this._element).data(),
                config
            )
        }

        _getTabbable() {
            return this._jQueryUI ?
                $(this._element).find(':tabbable') :
                $(this._element).find(this._config.tabbableElements);
        }

        _manageFocus() {
            $(this._element)
                .off(Event.KEYDOWN_TAB)
                .on(Event.KEYDOWN_TAB, (event) => {
                    if (!this._isEnabled && !$(this._element).is(':visible')) return true
                    if (event.which === TAB_KEYCODE) {
                        $(document).trigger(Event.TAB_PRESS)
                        let tabIndex = this._$tabbable.index(event.target)
                        let conditions = {
                            outside: tabIndex < 0,
                            wrapForward: tabIndex === this._$tabbable.length - 1 && !event.shiftKey,
                            wrapBackward: tabIndex === 0 && event.shiftKey
                        }
                        if (conditions.outside || conditions.wrapForward) {
                            event.preventDefault()
                            this._$tabbable.first().focus()
                        }
                        if (conditions.wrapBackward) {
                            event.preventDefault()
                            this._$tabbable.last().focus()
                        }
                    }
                })
        }

        _setEscapeEvent() {
            if (this._config.disableOnEscape && $(this._element).is(':visible')) {
                $(this._element).on(Event.KEYDOWN_DISABLE, (event) => {
                    if (event.which === ESCAPE_KEYCODE) {
                        this.disable()
                    }
                })
            }
        }


        // static

        static _jQueryInterface(config) {
            return this.each(function() {
                let data    = $(this).data(DATA_KEY)
                let _config = typeof config === 'object' ?
                    config : null

                if (!data && /destroy|hide/.test(config)) {
                    return
                }

                if (!data) {
                    data = new Tabtrap(this, _config)
                    $(this).data(DATA_KEY, data)
                }

                if (typeof config === 'string') {
                    if (data[config] === undefined) {
                        throw new Error(`No method named "${config}"`)
                    }
                    data[config]()
                }
            })
        }

    }


    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn[NAME]             = Tabtrap._jQueryInterface
    $.fn[NAME].Constructor = Tabtrap
    $.fn[NAME].noConflict  = function() {
        $.fn[NAME] = JQUERY_NO_CONFLICT
        return Tabtrap._jQueryInterface
    }

    return Tabtrap

})(jQuery)

export default Tabtrap
