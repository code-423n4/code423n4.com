export function isDangerousHandle(s) {
  return s.match(/^[0-9a-zA-Z_\-]+$/) === null;
}
