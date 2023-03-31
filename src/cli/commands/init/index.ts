import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'node:fs';
import path from 'node:path';
import { AutodocRepoConfig, LLMModels } from '../../../types.js';

export const makeConfigTemplate = (
  config?: AutodocRepoConfig,
): AutodocRepoConfig => {
  return {
    name: config?.name ?? '',
    repositoryUrl: config?.repositoryUrl ?? '',
    root: '.',
    output: './.autodoc',
    llms:
      config?.llms?.length ?? 0 > 0
        ? (config as AutodocRepoConfig).llms
        : [LLMModels.GPT3],
    ignore: [
      '.*',
      '*package-lock.json',
      '*package.json',
      'node_modules',
      '*dist*',
      '*build*',
      '*test*',
      '*.svg',
      '*.md',
      '*.mdx',
      '*.toml',
      '*autodoc*',
    ],
    filePrompt:
      'Write a detailed technical explanation of what this code does. \n\
      Focus on the high-level purpose of the code and how it may be used in the larger project.\n\
      Include code examples where appropriate. Keep you response between 100 and 300 words. \n\
      DO NOT RETURN MORE THAN 300 WORDS.\n\
      Output should be in markdown format.\n\
      Do not just list the methods and classes in this file.',
    folderPrompt:
      'Write a technical explanation of what the code in this folder does\n\
      and how it might fit into the larger project or work with other parts of the project.\n\
      Give examples of how this code might be used. Include code examples where appropriate.\n\
      Be concise. Include any information that may be relevant to a developer who is curious about this code.\n\
      Keep you response under 400 words. Output should be in markdown format.\n\
      Do not just list the files and folders in this folder.',
    chatPrompt: '',
    contentType: 'code',
    targetAudience: 'smart developer',
    linkHosted: false,
  };
};

export const init = async (
  config: AutodocRepoConfig = makeConfigTemplate(),
) => {
  const configPath = path.join(config.root, 'autodoc.config.json');

  if (fs.existsSync(configPath)) {
    const questions = [
      {
        type: 'confirm',
        name: 'continue',
        message:
          'An autodoc.config.json file already exists in this location. The existing configuration will be overwritten. Do you want to continue? ',
        default: false,
      },
    ];

    const answers = await inquirer.prompt(questions);
    if (!answers.continue) {
      process.exit(0);
    }
  }

  const questions = [
    {
      type: 'input',
      name: 'name',
      message: chalk.yellow(`Enter the name of your repository:`),
      default: config.name,
    },
    {
      type: 'input',
      name: 'repositoryUrl',
      message: chalk.yellow(`Enter the GitHub URL of your repository:`),
      default: config.repositoryUrl,
    },
    {
      type: 'list',
      name: 'llms',
      message: chalk.yellow(
        `Select which LLMs you have access to (use GPT-3.5 Turbo if you aren't sure):`,
      ),
      default: 0,
      choices: [
        {
          name: 'GPT-3.5 Turbo',
          value: [LLMModels.GPT3],
        },
        {
          name: 'GPT-3.5 Turbo, GPT-4 8K (Early Access)',
          value: [LLMModels.GPT3, LLMModels.GPT4],
        },
        {
          name: 'GPT-3.5 Turbo, GPT-4 8K (Early Access), GPT-4 32K (Early Access)',
          value: [LLMModels.GPT3, LLMModels.GPT4, LLMModels.GPT432k],
        },
      ],
    },
  ];

  const { name, repositoryUrl, llms } = await inquirer.prompt(questions);

  const newConfig = makeConfigTemplate({
    ...config,
    name,
    repositoryUrl,
    llms,
  });

  fs.writeFileSync(
    path.join(newConfig.root, 'autodoc.config.json'),
    JSON.stringify(newConfig, null, 2),
    'utf-8',
  );

  console.log(
    chalk.green('Autodoc initialized. Run `doc index` to get started.'),
  );
};
