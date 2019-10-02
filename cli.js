#!/usr/bin/env node

const path = require("path");
const meow = require("meow");
const { renderApp } = require("./dist/index");

const cli = meow(
  `
  Usage:
    $ yex <options>

  Options:
    --limit, -l     Limit number of items to display.
    --copy, -c      Copy command to clipboard.
    --help, -h      Display this message.
    --version, -v   CLI Version.

  Examples:
    $ yex
    $ yex --limit=5
`,
  {
    flags: {
      limit: {
        type: "string",
        alias: "l",
      },
      copy: {
        type: "boolean",
        alias: "c",
      },
      help: {
        type: "boolean",
        alias: "h",
      },
      version: {
        type: "boolean",
        alias: "v",
      },
    },
  },
);

try {
  require(path.resolve("package.json"));
} catch (err) {
  console.log(
    "\x1b[31m",
    `Error: This doesn't look like a node project. No "package.json" found.`,
  );
  process.exit(1);
}

if (!cli.flags.hasOwnProperty("limit")) {
  const workspaceItemHeight = 3;
  const [, terminalHeight] = process.stdout.getWindowSize();
  cli.flags.limit = terminalHeight / workspaceItemHeight;
}

renderApp(cli.flags);
