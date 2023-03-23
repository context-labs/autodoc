#!/usr/bin/env node
import { Command } from 'commander';
import { spinnerError, stopSpinner } from './cli/spinner';
// import { ingest } from './cli/commands/ingest';
const program = new Command();
program.description('Our New CLI');
program.version('0.0.1');

program
  .command('estimate')
  .description('Estimate the cost of running `ingest` on your codebase.')
  .action(() => {
    console.log('ingest');
  })
  .command('ingest')
  .description('Traverse your repository and ingest all the files into an LLM.')
  .action(() => {
    console.log('ingest');
  })
  .command('run')
  .description('Start the autodoc web UI on port 6969')
  .action(() => {
    console.log('ingest');
  });

process.on('unhandledRejection', function (err: Error) {
  // listen for unhandled promise rejections
  const debug = program.opts().verbose; // is the --verbose flag set?
  if (debug) {
    console.error(err.stack); // print the stack trace if we're in verbose mode
  }
  spinnerError(); // show an error spinner
  stopSpinner(); // stop the spinner
  program.error('', { exitCode: 1 }); // exit with error code 1
});

program.parse();
