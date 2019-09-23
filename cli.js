#!/usr/bin/env node

const path = require("path");
const { renderApp } = require("./dist/index");

try {
  require(path.resolve("package.json"));
} catch (err) {
  console.log(
    "\x1b[31m",
    `Error: This doesn't look like a node project. No "package.json" found.`,
  );
  process.exit(1);
}

renderApp();
