#!/usr/bin/env node

import fs from 'node:fs/promises';
import { Command } from 'commander';
import { spinnerError, stopSpinner } from './cli/spinner.js';
import { init } from './cli/commands/init/index.js';
import { estimate } from './cli/commands/estimate/index.js';
import { index } from './cli/commands/index/index.js';
import { query } from './cli/commands/query/index.js';
import { AutodocConfig } from './types.js';
import inquirer from 'inquirer';
import chalk from 'chalk';

const program = new Command();
program.description('Autodoc CLI Tool');
program.version('0.0.1');

program
  .command('init')
  .description(
    'Initialize Autodoc by creating a `autodoc.config.json` file in the current directory.',
  )
  .action(async () => {
    try {
      const config: AutodocConfig = JSON.parse(
        await fs.readFile('./autodoc.config.json', 'utf8'),
      );
      init(config);
    } catch (e) {
      init();
    }
  });

program
  .command('estimate')
  .description('Estimate the cost of running `index` on your codebase.')
  .action(async () => {
    try {
      const config: AutodocConfig = JSON.parse(
        await fs.readFile('./autodoc.config.json', 'utf8'),
      );
      estimate(config);
    } catch (e) {
      console.error(
        'Failed to find `autodoc.config.json` file. Are you in the right directory?',
      );
      console.error(e);
      process.exit(1);
    }
  });

program
  .command('index')
  .description(
    'Traverse your codebase, write docs via LLM, and create an index.',
  )
  .action(async () => {
    try {
      const config: AutodocConfig = JSON.parse(
        await fs.readFile('./autodoc.config.json', 'utf8'),
      );

      estimate(config);

      const questions = [
        {
          type: 'confirm',
          name: 'continue',
          message: 'Do you want to continue?',
          default: false,
        },
      ];

      const answers = await inquirer.prompt(questions);
      console.log(answers);
      if (answers.continue) {
        console.log('Continuing...');
        console.log('HIT HERE');
      } else {
        console.log('Exiting...');
        process.exit(0);
      }

      // index(config);
    } catch (e) {
      console.error(
        'Failed to find `autodoc.config.json` file. Are you in the right directory?',
      );
      console.error(e);
      process.exit(1);
    }
  });

program
  .command('q')
  .description('Query an Autodoc index')
  .action(async () => {
    try {
      const config: AutodocConfig = JSON.parse(
        await fs.readFile('./autodoc.config.json', 'utf8'),
      );
      query(config);
    } catch (e) {
      console.error('Failed to config file. Are you in the right directory?');
      console.error(e);
      process.exit(1);
    }
  });

/**
 * Listen for unhandled promise rejections
 */
process.on('unhandledRejection', function (err: Error) {
  console.error(err.stack);

  spinnerError(); // show an error spinner
  stopSpinner(); // stop the spinner
  program.error('', { exitCode: 1 }); // exit with error code 1
});

program.parse();
