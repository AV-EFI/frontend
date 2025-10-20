// Dummy shim for accidental `node:sqlite` imports in dependencies.
// Node has no built-in 'sqlite' module.
export default {};
export const Database = function () {
  throw new Error('Reached node:sqlite shim — a dependency imported a non-existent built-in.');
};
