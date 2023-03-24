#!/usr/bin/env node
import fs from 'node:fs/promises';
import { Command } from 'commander';
import { spinnerError, stopSpinner } from './cli/spinner.js';
import { index } from './cli/commands/index/index.js';
import { AutodocConfig } from './types.js';
const program = new Command();
program.description('Our New CLI');
program.version('0.0.1');

program
  .command('estimate')
  .description('Estimate the cost of running `index` on your codebase.')
  .action(() => {
    console.log('estimate');
  });

program
  .command('index')
  .description('Traverse your repository and index all the files into an LLM.')
  .action(async () => {
    const config: AutodocConfig = JSON.parse(
      await fs.readFile('./autodoc.config.json', 'utf8'),
    );

    index(config);
  });

program
  .command('q')
  .description('Traverse your repository and index all the files into an LLM.')
  .action(async () => {
    const config: AutodocConfig = JSON.parse(
      await fs.readFile('./autodoc.config.json', 'utf8'),
    );

    index(config);
  });

program
  .command('run')
  .description('Start the autodoc web UI on port 6969')
  .action(() => {
    console.log('index');
  });

process.on('unhandledRejection', function (err: Error) {
  // listen for unhandled promise rejections

  console.error(err.stack); // print the stack trace if we're in verbose mode

  spinnerError(); // show an error spinner
  stopSpinner(); // stop the spinner
  program.error('', { exitCode: 1 }); // exit with error code 1
});

program.parse();
