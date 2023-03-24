import chalk from 'chalk';
import inquirer from 'inquirer';
import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';
import clear from 'clear';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import path from 'path';
import { HNSWLib } from '../../../langchain/hnswlib.js';
import { makeChain } from './createChatChain.js';
const chatHistory = [];
marked.setOptions({
    // Define custom renderer
    renderer: new TerminalRenderer(),
});
const displayWelcomeMessage = (projectName) => {
    console.log(chalk.bold.blue(`Welcome to the ${projectName} autodoc chatbot.`));
    console.log(`Ask any questions related to the ${projectName} codebase, and I'll try to help. Type 'exit' to quit.\n`);
};
const clearScreenAndMoveCursorToTop = () => {
    process.stdout.write('\x1B[2J\x1B[0f');
};
export const query = async ({ name, repositoryUrl, output }) => {
    const data = path.join(output, 'docs', 'data/');
    const vectorStore = await HNSWLib.load(data, new OpenAIEmbeddings());
    const chain = makeChain(name, repositoryUrl, vectorStore, (token) => {
        process.stdout.write(token);
    });
    clear(); // Clear the terminal screen
    clearScreenAndMoveCursorToTop();
    displayWelcomeMessage(name);
    const getQuestion = async () => {
        const { question } = await inquirer.prompt([
            {
                type: 'input',
                name: 'question',
                message: chalk.yellow(`How can I help with ${name}?`),
            },
        ]);
        return question;
    };
    let question = await getQuestion();
    while (question !== 'exit') {
        try {
            const { text } = await chain.call({
                question,
                chat_history: chatHistory,
            });
            chatHistory.push([question, text]);
            console.log(chalk.green(marked(text)));
            question = await getQuestion();
        }
        catch (error) {
            console.log(chalk.red(`Something went wrong: ${error.message}`));
            question = await getQuestion();
        }
    }
};
//# sourceMappingURL=index.js.map