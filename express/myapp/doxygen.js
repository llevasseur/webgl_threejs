var doxygen = require('doxygen');
var userOptions = {
  OUTPUT_DIRECTORY: "Docs",
  INPUT: "./",
  RECURSIVE: "YES",
  FILE_PATTERNS: ["*.js", "*.md"],
  EXTENSION_MAPPING: "js=Javascript",
  GENERATE_LATEX: "NO",
  EXCLUDE_PATTERNS: ["*/node_modules/*", "*/jsm/*", "*/three.module/*"]
};

doxygen.downloadVersion().then(function (data) {
  doxygen.createConfig(userOptions);
  doxygen.run();
});