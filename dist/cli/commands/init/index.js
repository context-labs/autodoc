import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'node:fs';
import path from 'node:path';
export const makeConfigTemplate = (config) => {
    return {
        name: config?.name ?? '',
        repositoryUrl: config?.repositoryUrl ?? '',
        root: '.',
        output: './.autodoc',
        llms: ['gpt-3.5-turbo', 'gpt-4'],
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
    };
};
export const init = async (config = makeConfigTemplate()) => {
    const configPath = path.join(config.root, 'autodoc.config.json');
    if (fs.existsSync(configPath)) {
        const questions = [
            {
                type: 'confirm',
                name: 'continue',
                message: 'An autodoc.config.json file already exists in this location. The existing configuration will be overwritten. Do you want to continue? ',
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
    ];
    const { name, repositoryUrl } = await inquirer.prompt(questions);
    const newConfig = makeConfigTemplate({
        ...config,
        name,
        repositoryUrl,
    });
    fs.writeFileSync(path.join(newConfig.root, 'autodoc.config.json'), JSON.stringify(newConfig, null, 2), 'utf-8');
    console.log(chalk.green('Autodoc initialized. Run `doc index` to get started.'));
};
//# sourceMappingURL=index.js.map