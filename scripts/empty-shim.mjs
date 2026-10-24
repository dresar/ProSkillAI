export const readFileSync = () => "";
export const writeFileSync = () => {};
export const existsSync = () => false;
export const statSync = () => ({ isDirectory: () => false, isFile: () => false });
export const mkdirSync = () => {};
export const readdirSync = () => [];
export const rmSync = () => {};
export const unlinkSync = () => {};
export const promises = {
  readFile: async () => "",
  writeFile: async () => {},
  stat: async () => ({ isDirectory: () => false, isFile: () => false }),
  mkdir: async () => {},
  readdir: async () => [],
};
export default {
  readFileSync,
  writeFileSync,
  existsSync,
  statSync,
  mkdirSync,
  readdirSync,
  rmSync,
  unlinkSync,
  promises,
};
