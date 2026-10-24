export const setTimeout = globalThis.setTimeout;
export const clearTimeout = globalThis.clearTimeout;
export const setInterval = globalThis.setInterval;
export const clearInterval = globalThis.clearInterval;
export let setImmediate = globalThis.setImmediate || ((fn, ...args) => globalThis.setTimeout(fn, 0, ...args));
export let clearImmediate = globalThis.clearImmediate || ((id) => globalThis.clearTimeout(id));

const timers = {
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  get setImmediate() {
    return setImmediate;
  },
  set setImmediate(v) {
    setImmediate = v;
  },
  get clearImmediate() {
    return clearImmediate;
  },
  set clearImmediate(v) {
    clearImmediate = v;
  },
};

export default timers;
