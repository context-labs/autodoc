import chalk from 'chalk';
import inquirer from 'inquirer';
import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import { userConfigFileName, userConfigFilePath } from '../../../const.js';
import { AutodocUserConfig, LLMModels } from '../../../types.js';

export const makeConfigTemplate = (
  config?: AutodocUserConfig,
): AutodocUserConfig => {
  return {
    llms: config?.llms ?? [LLMModels.GPT3],
  };
};

export const user = async (
  config: AutodocUserConfig = makeConfigTemplate(),
) => {
  if (fsSync.existsSync(userConfigFilePath)) {
    const questions = [
      {
        type: 'confirm',
        name: 'continue',
        message:
          'A user configureation already exists. It will be overwritten. Do you want to continue?',
        default: false,
      },
    ];

    const answers = await inquirer.prompt(questions);
    if (!answers.continue) {
      process.exit(0);
    }
  } else {
    try {
      fs.mkdir(userConfigFilePath.replace(userConfigFileName, ''), {
        recursive: true,
      });
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  const questions = [
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

  const { llms } = await inquirer.prompt(questions);

  const newConfig = makeConfigTemplate({
    ...config,
    llms,
  });

  await fs.writeFile(
    userConfigFilePath,
    JSON.stringify(newConfig, null, 2),
    'utf-8',
  );

  console.log(
    chalk.green(
      'Autodoc user configuration saved. Run `doc q` to start querying.',
    ),
  );
};
