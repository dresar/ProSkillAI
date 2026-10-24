export const readFileSync = () => "";
export const writeFileSync = () => {};
export const existsSync = () => false;
export const statSync = () => ({ isDirectory: () => false, isFile: () => false });
export const lstatSync = () => ({ isDirectory: () => false, isFile: () => false });
export const mkdirSync = () => {};
export const readdirSync = () => [];
export const rmSync = () => {};
export const unlinkSync = () => {};
export const createReadStream = () => ({ on: () => {}, pipe: () => {} });
export const createWriteStream = () => ({ on: () => {}, write: () => {}, end: () => {} });

export const promises = {
  readFile: async () => "",
  writeFile: async () => {},
  stat: async () => ({ isDirectory: () => false, isFile: () => false }),
  mkdir: async () => {},
  readdir: async () => [],
  rm: async () => {},
  unlink: async () => {},
};

export class Session {
  connect() {}
  disconnect() {}
  post() {}
  on() {}
}
export const open = () => {};
export const close = () => {};
export const url = () => undefined;
export const waitForDebugger = () => {};

export const exec = () => {};
export const execSync = () => "";
export const spawn = () => ({ on: () => {}, stdout: { on: () => {} }, stderr: { on: () => {} } });
export const spawnSync = () => ({ status: 0, stdout: "", stderr: "" });
export const fork = () => {};

export const lookup = (h, cb) => (cb ? cb(null, "127.0.0.1", 4) : Promise.resolve({ address: "127.0.0.1", family: 4 }));
export const resolve = (h, cb) => (cb ? cb(null, []) : Promise.resolve([]));
export const resolve4 = (h, cb) => (cb ? cb(null, []) : Promise.resolve([]));
export const resolve6 = (h, cb) => (cb ? cb(null, []) : Promise.resolve([]));

export class Socket {
  connect() { return this; }
  on() { return this; }
  write() {}
  end() {}
  destroy() {}
}
export class Server {
  listen() { return this; }
  close() {}
  on() { return this; }
}
export const createConnection = () => new Socket();
export const createServer = () => new Server();
export const isIP = () => 0;
export const isIPv4 = () => false;
export const isIPv6 = () => false;

export const connect = () => ({ on: () => {}, write: () => {}, end: () => {} });

export const getHeapStatistics = () => ({});
export const serialize = () => new Uint8Array();
export const deserialize = () => ({});

export const createContext = (ctx) => ctx || {};
export const runInContext = () => undefined;
export const runInNewContext = () => undefined;
export const runInThisContext = () => undefined;
export class Script {
  runInContext() {}
  runInNewContext() {}
  runInThisContext() {}
}

const known = {
  readFileSync,
  writeFileSync,
  existsSync,
  statSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  rmSync,
  unlinkSync,
  createReadStream,
  createWriteStream,
  promises,
  Session,
  open,
  close,
  url,
  waitForDebugger,
  exec,
  execSync,
  spawn,
  spawnSync,
  fork,
  lookup,
  resolve,
  resolve4,
  resolve6,
  Socket,
  Server,
  createConnection,
  createServer,
  isIP,
  isIPv4,
  isIPv6,
  connect,
  getHeapStatistics,
  serialize,
  deserialize,
  createContext,
  runInContext,
  runInNewContext,
  runInThisContext,
  Script,
};

const dummy = new Proxy(function () {}, {
  get(target, prop) {
    if (prop === "__esModule") return true;
    if (prop === "default") return dummy;
    if (prop in known) return known[prop];
    return dummy;
  },
  apply() {
    return dummy;
  },
  construct() {
    return dummy;
  },
});

export default dummy;
