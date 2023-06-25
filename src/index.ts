import { DEFAULT_MAX_LISTENERS, EVENTS } from './constants';

import { DeventorOptions } from './types';

class Deventor {
  #maxListeners: number;
  #events: Map<string, Function[]>;

  constructor(options?: DeventorOptions) {
    this.#maxListeners = options?.maxListeners || DEFAULT_MAX_LISTENERS;

    this.#events = new Map();
  }

  setMaxListeners(newMaxListeners: number): Deventor {
    const oldMaxListeners = this.#maxListeners;

    this.#maxListeners = newMaxListeners;

    this.emit(EVENTS.SET_MAX_LISTENERS, {
      oldMaxListeners,
      newMaxListeners, 
    });

    return this;
  }

  getEventNames(): string[] {
    return Array.from(this.#events.keys());
  }

  getMaxListeners(): number {
    return this.#maxListeners;
  }

  on(eventName: string, listener: Function): Deventor {
    let newListeners: Function[] = []

    if (this.#events.has(eventName)) {
      newListeners = this.#events.get(eventName) || [];
    }

    newListeners.push(listener);

    this.#events.set(eventName, newListeners);

    if (newListeners.length > this.#maxListeners) {
      console.warn('Max. listeners exceeded to \'' + eventName + '\' event. Max. listeners = ' + this.#maxListeners + '. Take care of memory leaks.');
    }

    return this;
  }

  once(eventName: string, listener: Function): Deventor {
    const self = this;

    self.on(eventName, function subListener (...args: any[]) {
      self.off(eventName, subListener);
      listener.apply(self, args);
    });

    return this;
  }

  off(eventName: string, listener: Function): Deventor {
    if (this.#events.has(eventName)) {
      const currentListener = this.#events.get(eventName) || [];

      const index = currentListener.indexOf(listener);

      if (index > -1) {
        const listenerToRemove = currentListener[index];
        currentListener.splice(index, 1);
        this.#events.set(eventName, currentListener);

        this.emit(EVENTS.REMOVE_LISTENER, {
          eventName,
          listener: listenerToRemove,
        });
      }
    }

    return this;
  }

  emit(eventName: string, ...args: any[]): Deventor {
    if (this.#events.has(eventName)) {
      const listenersByEventName = this.#events.get(eventName)?.slice();

      if (listenersByEventName) {
        listenersByEventName.forEach((eachCallback: Function) => {
          eachCallback.apply(this, args);
        });
      }
    }

    return this;
  }

  removeAllListeners(): Deventor {
    const self = this;

    Array.from(this.#events.keys()).forEach((eachEvent) => {
      const listeners = this.#events.get(eachEvent) || [];

      listeners.forEach((eachListener) => {
        self.off(eachEvent, eachListener);
      });
    });

    return this;
  }

  // Alias for 'on' method
  addListener(eventName: string, listener: Function): Deventor {
    return this.on(eventName, listener);
  }

  // Alias for 'off' method
  removeListener(eventName: string, listener: Function): Deventor {
    return this.off(eventName, listener);
  }
}

export default Deventor;
