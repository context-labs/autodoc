#!/usr/bin/env node

import fs from 'node:fs/promises';
import { Command } from 'commander';
import { spinnerError, stopSpinner } from './cli/spinner.js';
import { init } from './cli/commands/init/index.js';
import { estimate } from './cli/commands/estimate/index.js';
import { index } from './cli/commands/index/index.js';
import { query } from './cli/commands/query/index.js';
import { AutodocRepoConfig, AutodocUserConfig } from './types.js';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { user } from './cli/commands/user/index.js';
import { userConfigFilePath } from './const.js';

const program = new Command();
program.description('Autodoc CLI Tool');
program.version('0.0.9');

program
  .command('init')
  .description(
    'Initialize repository by creating a `autodoc.config.json` file in the current directory.',
  )
  .action(async () => {
    try {
      const config: AutodocRepoConfig = JSON.parse(
        await fs.readFile('./autodoc.config.json', 'utf8'),
      );
      init(config);
    } catch (e) {
      init();
    }
  });

program
  .command('estimate')
  .description('Estimate the cost of running `index` on your respository.')
  .action(async () => {
    try {
      const config: AutodocRepoConfig = JSON.parse(
        await fs.readFile('./autodoc.config.json', 'utf8'),
      );
      estimate(config);
    } catch (e) {
      console.error(
        'Failed to find `autodoc.config.json` file. Did you run `doc init`?',
      );
      console.error(e);
      process.exit(1);
    }
  });

program
  .command('index')
  .description(
    'Traverse your codebase, write docs via LLM, and create a locally stored index.',
  )
  .action(async () => {
    try {
      const config: AutodocRepoConfig = JSON.parse(
        await fs.readFile('./autodoc.config.json', 'utf8'),
      );

      await estimate(config);

      const questions = [
        {
          type: 'confirm',
          name: 'continue',
          message: 'Do you want to continue with indexing?',
          default: true,
        },
      ];

      const answers = await inquirer.prompt(questions);

      if (answers.continue) {
        console.log(chalk.green('Starting crawl...'));
        index(config);
      } else {
        console.log('Exiting...');
        process.exit(0);
      }
    } catch (e) {
      console.error(
        'Failed to find `autodoc.config.json` file. Did you run `doc init`?',
      );
      console.error(e);
      process.exit(1);
    }
  });

program
  .command('user')
  .description('Set the Autodoc user config')
  .action(async () => {
    try {
      const config: AutodocUserConfig = JSON.parse(
        await fs.readFile(userConfigFilePath, 'utf8'),
      );
      user(config);
    } catch (e) {
      user();
    }
  });

program
  .command('q')
  .description('Query an Autodoc index')
  .action(async () => {
    let repoConfig: AutodocRepoConfig;
    try {
      repoConfig = JSON.parse(
        await fs.readFile('./autodoc.config.json', 'utf8'),
      );
    } catch (e) {
      console.error(
        'Failed to find `autodoc.config.json` file. Did you run `doc init`?',
      );
      console.error(e);
      process.exit(1);
    }

    try {
      const userConfig: AutodocUserConfig = JSON.parse(
        await fs.readFile(userConfigFilePath, 'utf8'),
      );

      query(repoConfig, userConfig);
    } catch (e) {
      try {
        await user();
        const userConfig: AutodocRepoConfig = JSON.parse(
          await fs.readFile(userConfigFilePath, 'utf8'),
        );
        query(repoConfig, userConfig);
      } catch (e) {
        console.error('Failed to config file. Did you run `doc init`?');
        console.error(e);
        process.exit(1);
      }
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
