# tabtrap
A jQuery plugin for trapping tab inside an object. Useful for ensuring keyboard accessibility of modals.

## Usage
```.tabtrap()```
``` js
$('.modal').tabtrap();
```

## Methods
```.tabtrap(options)```
``` js
$('.modal').tabtrap({
  disableOnEscape: false
});
```
```.tabtrap('disable')```
``` js
$('.modal #close').on('click', function (e) {
  $('.modal').tabtrap('disable');
});
```