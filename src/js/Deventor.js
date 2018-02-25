window.Deventor = (function () {
  var DEVENTOR_PREFIX = 'Deventor:';

  function Deventor (settings) {
    settings = settings || {};

    var _events = {};
    var _name = settings.name ? settings.name : 'deventor-' + new Date().getTime();
    var _maxListeners = settings.maxListeners && Number.isInteger(settings.maxListeners) ? settings.maxListeners : Deventor.defaultMaxListeners;

    this.getDeventorName = function () { return _name; };
    this.setDeventorName = function (deventorName) { _name = deventorName; };
    this.getMaxListeners = function () { return _maxListeners; };

    this.setMaxListeners = function (maxListeners) {
      var oldMaxListeners = _maxListeners;
      _maxListeners = maxListeners;

      this.emit(Deventor.DEVENTOR_EVENTS.SET_MAX_LISTENERS, {
        oldMaxListeners: oldMaxListeners,
        newMaxListeners: _maxListeners
      });

      return this;
    };

    this.getEventNames = function () { return Object.keys(_events); };
    this.getListenersByEventName = function (eventName) { return _events[eventName]; };

    this.on = function (eventName, listener) {
      if (typeof _events[eventName] !== 'object') _events[eventName] = [];

      this.emit(Deventor.DEVENTOR_EVENTS.NEW_LISTENER, {
        eventName: eventName,
        listener: listener
      });

      _events[eventName].push(listener);

      if (_events[eventName].length > _maxListeners) {
        console.warn('Max. listeners exceeded to \'' + eventName + '\' event. Max. listeners = ' + _maxListeners + '. Take care of memory leaks.');
      }

      return this;
    };

    this.once = function (eventName, listener) {
      this.on(eventName, function subListener () {
        this.off(eventName, subListener);
        listener.apply(this, arguments);
      });

      return this;
    };

    this.off = function (eventName, listener) {
      if (typeof _events[eventName] === 'object') {
        var index = _events[eventName].indexOf(listener);

        if (index > -1) {
          var listenerToRemove = _events[eventName][index];
          _events[eventName].splice(index, 1);

          this.emit(Deventor.DEVENTOR_EVENTS.REMOVE_LISTENER, {
            eventName: eventName,
            listener: listenerToRemove
          });
        }
      }

      return this;
    };

    this.emit = function (eventName/*, arguments */) {
      var args = [].slice.call(arguments, 1);

      if (typeof _events[eventName] === 'object') {
        var listeners = _events[eventName].slice();
        var length = listeners.length;

        for (var iterator = 0; iterator < length; iterator++) {
          listeners[iterator].apply(this, args);
        }
      }

      return this;
    };

    this.removeAllListeners = function () {
      var self = this;

      for (var eventName in _events) {
        if (_events.hasOwnProperty(eventName)) {
          for (var iterator = 0; iterator < _events[eventName].length; iterator++) {
            self.off(eventName, _events[eventName][iterator]);
          }
        }
      }

      return this;
    };

    // Alias for 'on' method
    this.addListener = function (eventName, listener) {
      return this.on(eventName, listener);
    };

    // Alias for 'off' method
    this.removeListener = function (eventName, listener) {
      return this.off(eventName, listener);
    };
  }

  Deventor.defaultMaxListeners = 10;
  Deventor.DEVENTOR_EVENTS = {
    NEW_LISTENER: DEVENTOR_PREFIX + 'newListener',
    REMOVE_LISTENER: DEVENTOR_PREFIX + 'removeListener',
    SET_MAX_LISTENERS: DEVENTOR_PREFIX + 'setMaxListeners'
  };

  return Deventor;
})();
