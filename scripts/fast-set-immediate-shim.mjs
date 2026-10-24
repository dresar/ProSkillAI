export const DANGEROUSLY_runPendingImmediatesAfterCurrentTask = () => {};
export class ImmediateTracker {
  hasPendingImmediates() {
    return false;
  }
}
export const expectNoPendingImmediates = () => {};
export const runWithNativeImmediateTracking = (tracker, fn, ...args) => fn(...args);
export const unpatchedSetImmediate = globalThis.setImmediate;

export default {
  DANGEROUSLY_runPendingImmediatesAfterCurrentTask,
  ImmediateTracker,
  expectNoPendingImmediates,
  runWithNativeImmediateTracking,
  unpatchedSetImmediate,
};
