# deventor API reference

`deventor` is a minimal event emitter system built entirely in pure Javascript with 0 dependencies, focused on the browser.

* **Class**: [Deventor(deventorSettings)](#class-deventordeventorsettings)
* **Event**: [Deventor:newListener](#event-deventornewlistener)
* **Event**: [Deventor:removeListener](#event-deventorremovelistener)
* **Event**: [Deventor:setMaxListeners](#event-deventorsetmaxlisteners)
* **Static Attribute**: [Deventor.defaultMaxListeners](#static-attribute-deventordefaultmaxlisteners)
* **Static Attribute**: [Deventor.DEVENTOR_EVENTS](#static-attribute-deventordeventor_events)
* **Method**: [deventor.getDeventorName()](#method-deventorgetdeventorname)
* **Method**: [deventor.setDeventorName(deventorName)](#method-deventorsetdeventornamedeventorname)
* **Method**: [deventor.getMaxListeners()](#method-deventorgetmaxlisteners)
* **Method**: [deventor.setMaxListeners(maxListeners)](#method-deventorsetmaxlistenersmaxlisteners)
* **Method**: [deventor.getEventNames()](#method-deventorgeteventnames)
* **Method**: [deventor.getListenersByEventName(eventName)](#method-deventorgetlistenersbyeventnameeventname)
* **Method**: [deventor.on(eventName, listener)](#method-deventoroneventname-listener)
* **Method**: [deventor.once(eventName, listener)](#method-deventoronceeventname-listener)
* **Method**: [deventor.off(eventName, listener)](#method-deventoroffeventname-listener)
* **Method**: [deventor.emit(eventName[,...args])](#method-deventoremiteventnameargs)
* **Method**: [deventor.removeAllListeners()](#method-deventorremovealllisteners)
* **Method**: [deventor.addListener(eventName, listener)](#method-deventoraddlistenereventname-listener)
* **Method**: [deventor.removeListener(eventName, listener)](#method-deventorremovelistenereventname-listener)

## Class: Deventor(deventorSettings)

The `Deventor` constructor can accept an object parameter with two attributes:

* **name** _{?String}_ The name of the `Deventor` instance
* **maxListeners** _{?Number}_ The value of the maximum listeners of the `Deventor` instance

```javascript
var myDeventor = new Deventor({
  name: 'myDeventor',
  maxListeners: 20
});
```

## Event: Deventor:newListener

* **eventName** _{String}_ The name of the event being listened for
* **listener** _{Function}_ The event handler function

The `Deventor` instance will emit its own `'Deventor:newListener'` event _before_ a listener is added to its internal array of listeners.

```javascript
var myDeventor = new Deventor();

// Only do this once so we don't loop forever
myDeventor.once(Deventor.DEVENTOR_EVENTS.NEW_LISTENER, function (eventName, listener) {
  if (eventName === 'myEvent') {
    myDeventor.on('myEvent', function () {
      console.log('B');
    });
  }
});

myDeventor.on('myEvent', function () {
  console.log('A');
});

myDeventor.emit('myEvent');
// Prints:
// B
// A
```

## Event: Deventor:removeListener

* **eventName** _{String}_ The name of the event
* **listener** _{Function}_ The event handler function to be removed

The `Deventor` instance will emit its own `'Deventor:removeListener'` event _after_ the listener is removed from its internal array of listeners.

```javascript
var myDeventor = new Deventor();

var myEventHandler = function () {
  console.log('A');
};

myDeventor.on('myEvent', myEventHandler);

myDeventor.emit('myEvent');
// Prints:
// A

myDeventor.on(Deventor.DEVENTOR_EVENTS.REMOVE_LISTENER, function (eventName, listener) {
  console.log('Event Name -> ' + eventName);
  console.log('Listener to be removed -> ', listener);
});

myDeventor.off('myEvent', myEventHandler)
// Prints:
// Event name -> myEvent
// Listener to be removed -> Function
```

## Event: Deventor:setMaxListeners

* **oldMaxListeners** _{Number}_ The old value of maximum listeners of `Deventor` instance
* **newMaxListeners** _{Number}_ The new value of maximum listeners of `Deventor` instance

The `Deventor` instance will emit its own `'Deventor:setMaxListeners'` event _after_ the maxListeners attribute has changed.

```javascript
var myDeventor = new Deventor();

myDeventor.on(Deventor.DEVENTOR_EVENTS.SET_MAX_LISTENERS, function (result) {
  console.log('Old max listeners value -> ' + result.oldMaxListeners);
  console.log('New max listeners value -> ' + result.newMaxListeners);
});

myDeventor.setMaxListeners(20);
// Prints:
// Old max listeners value -> 10
// New max listeners value -> 20
```

## Static Attribute: Deventor.defaultMaxListeners

By default, a maximum of `10` listeners can be registered for any single event. This limit can be changed for individual `Deventor` instances using the [deventor.setMaxListeners(maxListeners)](#method-deventorsetmaxlistenersmaxlisteners) method. To change the default for all `Deventor` instances, the `Deventor.defaultMaxListeners` property can be used.

Note that this is not a hard limit. The `Deventor` instance will allow more listeners to be added but will output a trace warning to console indicating that "Max. listeners exceeded to [eventName] event. Max. listeners = [maxListeners]. Take care of memory leaks.". For any single `Deventor`, the [deventor.getMaxListeners()](#method-deventorgetmaxlisteners) and [deventor.setMaxListeners(maxListeners)](#method-deventorsetmaxlistenersmaxlisteners) methods can be used to temporarily avoid this warning:

```javascript
var myDeventor = new Deventor();

myDeventor.setMaxListeners(myDeventor.getMaxListeners() + 1);

myDeventor.once('event', function () {
  // ...

  myDeventor.setMaxListeners(Math.max(myDeventor.getMaxListeners() - 1, 0));
});
```
## Static Attribute: Deventor.DEVENTOR_EVENTS

## Method: deventor.getDeventorName()

Returns the name of the `Deventor` instance.

```javascript
var myDeventor = new Deventor({
  name: 'myDeventor'
});

console.log(myDeventor.getDeventorName());
// Prints:
// myDeventor
```

## Method: deventor.setDeventorName(deventorName)

Sets the name of the `Deventor` instance.

* **deventorName** _{String}_ The new `Deventor` name

```javascript
var myDeventor = new Deventor({
  name: 'myDeventor'
});

myDeventor.setDeventorName('myOtherDeventor');

console.log(myDeventor.getDeventorName());
// Prints:
// myOtherDeventor
```

## Method: deventor.getMaxListeners()

Returns the current max listeners value for the `Deventor` which is either set by [deventor.setMaxListeners(maxListeners)](#method-deventorsetmaxlistenersmaxlisteners) or defaults to [Deventor.defaultMaxListeners](#static-attribute-deventordefaultmaxlisteners)

```javascript
var myDeventor = new Deventor();
console.log(myDeventor.getMaxListeners());
// Prints:
// 10
```

## Method: deventor.setMaxListeners(maxListeners)

Sets the max listeners value for the `Deventor` instance.

* **maxListeners** _{Number}_ The new max listeners value for the `Deventor` instance

```javascript
var myDeventor = new Deventor();

myDeventor.setMaxListeners(30);

console.log(myDeventor.getMaxListeners());
// Prints:
// 30
```

## Method: deventor.getEventNames()

Returns an array listing the events which the emitter has registered listeners. The values in the array will be strings.

```javascript
var myDeventor = new Deventor();

myDeventor.on('event1', function () {
  // ...
});

myDeventor.on('event2', function () {
  // ...
});

console.log(myDeventor.getEventNames());
// Prints:
// ['event1', 'event2']
```
## Method: deventor.getListenersByEventName(eventName)

Returns an array listing the listeners of an event that has been registered. The values in the array will be functions.

* **eventName** _{String}_ The name of the event

```javascript
var myDeventor = new Deventor();

myDeventor.on('event1', function () {
  console.log('A');
});

myDeventor.on('event1', function () {
  console.log('B');
});

console.log(myDeventor.getListenersByEventName('event1'));
// Prints:
// [function () { console.log('A'); }, function () { console.log('B'); }]
```

## Method: deventor.on(eventName, listener)

* **eventName** _{String}_ The name of the event
* **listener** _{Function}_ The callback function

Adds the `listener` function to the end of the listeners array of the event named `eventName`. No checks are made to see if the `listener` has already been added. Multiple calls passing the same combination of `eventName` and `listener` will result in the `listener` being added, and called, multiple times. By default, event listeners are invoked in the order they are added.

```javascript
var myDeventor = new Deventor();

myDeventor.on('myEvent', function () {
  console.log('My event');
});
```

## Method: deventor.once(eventName, listener)

* **eventName** _{String}_ The name of the event
* **listener** _{Function}_ The callback function

Adds a **one time** `listener` function for the event named `eventName`. The next time `eventName` is triggered, this listener is removed and then invoked. By default, event listeners are invoked in the order they are added.

```javascript
var myDeventor = new Deventor();

myDeventor.once('myEvent', function () {
  console.log('My event');
});
```

## Method: deventor.off(eventName, listener)

* **eventName** _{String}_ The name of the event
* **listener** _{Function}_ The callback function

Removes the specified `listener` from the listener array for the event named `eventName`.

```javascript
var myDeventor = new Deventor();

var callback = function () {
  console.log('My event');
};

myDeventor.on('myEvent', callback);

myDeventor.off('myEvent', callback);
```

## Method: deventor.emit(eventName[,...args])

* **eventName** _{String}_ The name of the event
* **...args** _{?Any}_ The arguments to pass to the event

Synchronously calls each of the `listeners` registered for the event named `eventName`, in the order they were registered, passing the supplied arguments to each.

```javascript
var myDeventor = new Deventor();

myDeventor.on('myEvent', function (args) {
  console.log('My event with args -> ', args);
});

myDeventor.emit('myEvent', {
  attribute: 'attribute',
  value: 10
});
// Prints:
// My event with args -> { attribute: 'attribute', value: 10 }
```

## Method: deventor.removeAllListeners()

Removes all listeners.

```javascript
var myDeventor = new Deventor();

myDeventor.on('myEvent', function (args) {
  console.log('My event with args -> ', args);
});

myDeventor.on('myOtherEvent', function () {
  console.log('My other event');
});

myDeventor.removeAllListeners();
```

## Method: deventor.addListener(eventName, listener)

* **eventName** _{String}_ The name of the event
* **listener** _{Function}_ The callback function

Alias for [deventor.on(eventName, listener)](#method-deventoroneventname-listener)

## Method: deventor.removeListener(eventName, listener)

* **eventName** _{String}_ The name of the event
* **listener** _{Function}_ The callback function

Alias for [deventor.off(eventName, listener)](#method-deventoroffeventname-listener)
