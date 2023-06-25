const PREFIX = 'Deventor:';

const DEFAULT_MAX_LISTENERS = 10;

const EVENTS = Object.freeze({
  NEW_LISTENER: `${PREFIX}NewListener`,
  REMOVE_LISTENER: `${PREFIX}RemoveListener`,
  SET_MAX_LISTENERS: `${PREFIX}SetMaxListeners`,
});

export {
  PREFIX,
  DEFAULT_MAX_LISTENERS,
  EVENTS,
};
