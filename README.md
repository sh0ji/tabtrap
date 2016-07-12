# tabtrap
A jQuery plugin for trapping focus inside an object. Useful for ensuring keyboard accessibility of modals.

## Usage
`.tabtrap()`
```javascript
$('.modal').tabtrap();
```
Manages tab keypresses on the selected element (`.modal` in this example), but only when it's [`:visible`](https://api.jquery.com/visible-selector/).

## Options

| Option | Type | Default |
| - | - | - |
| `disableOnEscape` | boolean | `false` |
| `jQueryUI` | boolean | automatic* |
| `tabbableElements` | string | `'a[href]:not([tabindex="-1"]), map[name] area[href]:not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), iframe:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"]), [contentEditable=true]:not([tabindex="-1"])'` |


## Methods
NOTE: focus is only trapped when the element is visible. If you are managing the visibility of the element yourself, you shouldn't need to use any of these methods.

`.tabtrap(options)`
```javascript
$('.modal').tabtrap({
    disableOnEscape: true
});
```

`.tabtrap('enable')`
```javascript
$('#open').on('click', function (e) {
  $('.modal').tabtrap('enable');
});
```

`.tabtrap('disable')`
```javascript
$('#close').on('click', function (e) {
  $('.modal').tabtrap('disable');
});
```
