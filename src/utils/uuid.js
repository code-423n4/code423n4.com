/**
 * Code copied from stackoverflow answer:
 * https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 */

function dec2hex(dec) {
  return dec.toString(16).padStart(2, "0");
}

export function generateId() {
  if (typeof window !== "undefined") {
    var arr = new Uint8Array(20);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join("");
  }
}
