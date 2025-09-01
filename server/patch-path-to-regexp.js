// Monkey-patch path-to-regexp to log all parse inputs
try {
  const ptr = require("path-to-regexp");
  const origParse = ptr.parse;
  ptr.parse = function(pattern) {
    console.log("path-to-regexp.parse called with:", pattern);
    return origParse.apply(this, arguments);
  };
} catch (e) {
  console.warn("Could not patch path-to-regexp:", e);
}
