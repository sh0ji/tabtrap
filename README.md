# tabtrap
A jQuery plugin for trapping tab inside an object. Useful for ensuring keyboard accessibility of modals.

## Usage
`.tabtrap()`
```javascript
$('.modal').tabtrap();
```

## Methods
`.tabtrap(options)`
```javascript
$('.modal').tabtrap({
  disableOnEscape: false
});
```
`.tabtrap('disable')`
```javascript
$('.modal #close').on('click', function (e) {
  $('.modal').tabtrap('disable');
});
```