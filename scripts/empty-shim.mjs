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

export class Agent {
  constructor() {}
  destroy() {}
}
export class EventEmitter {
  on() { return this; }
  once() { return this; }
  emit() { return false; }
  removeListener() { return this; }
}
export const request = () => ({ on: () => {}, write: () => {}, end: () => {} });
export const get = () => ({ on: () => {}, write: () => {}, end: () => {} });
export const METHODS = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"];
export const STATUS_CODES = { 200: "OK", 404: "Not Found", 500: "Internal Server Error" };

export const cpus = () => [{ model: "CPU", speed: 2000, times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 } }];
export const totalmem = () => 1024 * 1024 * 1024;
export const freemem = () => 1024 * 1024 * 1024;
export const homedir = () => "/tmp";
export const tmpdir = () => "/tmp";
export const hostname = () => "cloudflare";
export const platform = () => "linux";
export const release = () => "1.0.0";
export const type = () => "Linux";
export const arch = () => "x64";
export const endianness = () => "LE";
export const networkInterfaces = () => ({});
export const userInfo = () => ({ username: "worker", uid: 0, gid: 0, homedir: "/tmp", shell: "" });
export const uptime = () => 0;
export const loadavg = () => [0, 0, 0];
export const constants = {};
export const EOL = "\n";

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
  cpus,
  totalmem,
  freemem,
  homedir,
  tmpdir,
  hostname,
  platform,
  release,
  type,
  arch,
  endianness,
  networkInterfaces,
  userInfo,
  uptime,
  loadavg,
  constants,
  EOL,
  Agent,
  EventEmitter,
  request,
  get,
  METHODS,
  STATUS_CODES,
};

const dummy = new Proxy(function () {}, {
  get(target, prop) {
    if (prop === "__esModule") return true;
    if (prop === "default") return dummy;
    if (prop === "then") return undefined;
    if (prop === Symbol.toPrimitive) return () => "";
    if (prop === Symbol.iterator) return function* () {};
    if (prop === "toString" || prop === "valueOf") return () => "";
    if (prop === "length") return 0;
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
