#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const spinner_1 = require("./cli/spinner");
const ingest_1 = require("./cli/commands/ingest");
const program = new commander_1.Command();
program.description('Our New CLI');
program.version('0.0.1');
program
    .command('estimate')
    .description('Estimate the cost of running `ingest` on your codebase.')
    .action(() => {
    console.log('estimate');
});
program
    .command('ingest')
    .description('Traverse your repository and ingest all the files into an LLM.')
    .action(ingest_1.ingest);
program
    .command('run')
    .description('Start the autodoc web UI on port 6969')
    .action(() => {
    console.log('ingest');
});
process.on('unhandledRejection', function (err) {
    // listen for unhandled promise rejections
    const debug = program.opts().verbose; // is the --verbose flag set?
    if (debug) {
        console.error(err.stack); // print the stack trace if we're in verbose mode
    }
    (0, spinner_1.spinnerError)(); // show an error spinner
    (0, spinner_1.stopSpinner)(); // stop the spinner
    program.error('', { exitCode: 1 }); // exit with error code 1
});
program.parse();
//# sourceMappingURL=index.js.map