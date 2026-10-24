export let setTimeout = (ms, val) =>
  new Promise((res) => globalThis.setTimeout(() => res(val), ms));
export let setImmediate = (val) =>
  new Promise((res) =>
    globalThis.setImmediate
      ? globalThis.setImmediate(() => res(val))
      : globalThis.setTimeout(() => res(val), 0)
  );
export let setInterval = async function* () {};
export const scheduler = { wait: (ms) => setTimeout(ms) };

const timersPromises = {
  get setTimeout() {
    return setTimeout;
  },
  set setTimeout(v) {
    setTimeout = v;
  },
  get setImmediate() {
    return setImmediate;
  },
  set setImmediate(v) {
    setImmediate = v;
  },
  setInterval,
  scheduler,
};

export default timersPromises;
