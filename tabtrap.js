;(function ($, window, document, undefined) {
  'use strict';

  var Tabtrap = function (element, options) {
    this.enabled   = null;
    this.options   = null;
    this.$element  = null;
    this.$tabbable = null;
    this.current   = null;

    this.init(element, options);
  };

  Tabtrap.VERSION = '1.0.0';

  Tabtrap.DEFAULTS = {
    jQueryUI: $.ui,
    disableOnEscape: true,
    tabbableElements: 'a[href]:not([tabindex="-1"]), map[name] area[href]:not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), iframe:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"]), [contentEditable=true]:not([tabindex="-1"])'
  };

  $.extend(Tabtrap.prototype, {

    init: function (element, options) {
      this.enabled      = true;
      this.$element     = $(element);
      this.options      = this.getOptions(options);
      this.$tabbable    = this.getTabbable();

      this.$element.on('keydown.a11y.tabtrap', $.proxy(this.trap, this));
    },

    trap: function (e) {
      // escape
      if (e.which === 27 && this.options.disableOnEscape) {
        this.disable();
        return false;
      }

      let current = this.getCurrent();

      // tab
      if (e.which === 9) {
        if (e.shiftKey) {
          if (current === 0) {
            e.preventDefault();
            this.focusLast();
          }
        } else {
          if (current === this.$tabbable.length - 1 || current < 0) {
            e.preventDefault();
            this.focusFirst();
          }
        }
      }
    },

    disable: function () {
      this.enabled = false;
      this.$tabbable = null;
      this.$element
        .off('keydown.a11y.tabtrap', $.proxy(this.trap, this))
        .removeData('a11y.tabtrap');
    },

    toggle: function () {
      return this.enabled ? this.disable() : this.trap();
    },

    getOptions: function (options) {
      return $.extend({}, Tabtrap.DEFAULTS, this.$element.data(), options);
    },

    getTabbable: function () {
      let tabbable = this.options.jQueryUI ? this.$element.find(':tabbable') : this.$element.find(this.options.tabbableElements);
      return this.enabled ? tabbable : null;
    },

    getCurrent: function () {
      return this.$tabbable ? this.$tabbable.index($(':focus')) : -1;
    },

    focusFirst: function () {
      this.$tabbable.first().focus();
    },

    focusLast: function () {
      this.$tabbable.last().focus();
    }
  });

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('a11y.tabtrap'),
          options = typeof option === 'object' && option;

      if (!data) $this.data('a11y.tabtrap', (data = new Tabtrap(this, options)));
      if (typeof option == 'string') data[option];
    });
  }

  var old = $.fn.tabtrap;

  $.fn.tabtrap             = Plugin;
  $.fn.tabtrap.Constructor = Tabtrap;

  $.fn.tabtrap.noConflict = function () {
    $.fn.tabtrap = old;
    return this;
  };

})(jQuery, window, document);
