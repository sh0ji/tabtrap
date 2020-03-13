# tabtrap

> Trap focus inside an element. Useful for ensuring keyboard accessibility of modal dialogs.

## Usage

## Options

All options are typed in [the `TabtrapOptions` interface](blob/master/src/tabtrap.ts#L3).

| Option | Type | Default |
| ------ | ---- | ------- |
| `disableOnEscape` | boolean | `false` |
| `tabbableElements` | string, NodeList, function | All valid focusable elements ([focusable.ts](blob/master/src/focusable.ts)) |
| `wrap` | boolean | `true` |

## API

The primary API is the `trapFocus` export, which takes an element and options.

```javascript
import { trapFocus } from 'tabtrap';

const myEl = document.querySelector('.my-element');
const opts = { wrap: false };

trapFocus(myEl, opts);
```

### Methods and Properties

Tabtrap also includes a few methods and properties that may be helpful.

* `Tabtrap.create(el, opts)` (static method): create a `Tabtrap` instance.
   - Note that this just creates the instance. Tab will not be trapped inside your element.
* `Tabtrap.instances` (static property): an array of all the in-scope `Tabtrap` instances.
* `.enable()` (instance method): turn on the tab trap.
* `.disable()` (instance method): disable the tab trap but keep the instance intact.
* `.destroy()` (instance method): destroy the instance entirely (also disables the tab trap).

#### Example

```javascript
import Tabtrap from 'tabtrap';

const myEl = document.querySelector('.my-element');
const opts = {};  // whatever overrides you like

const tabtrap = Tabtrap.create(myEl, opts);

tabtrap.enable();
// focus is now trapped inside `myEl`

console.log(Tabtrap.instances.length);
// 1

tabtrap.disable();
// focus can now escape `myEl`

tabtrap.destroy();

console.log(Tabtrap.instances.length);
// 0
```

