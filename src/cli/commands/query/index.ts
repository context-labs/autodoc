import chalk from 'chalk';
import inquirer from 'inquirer';
import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';
import clear from 'clear';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import path from 'path';
import { HNSWLib } from '../../../langchain/hnswlib.js';
import { AutodocConfig } from '../../../types.js';
import { makeChain } from './createChatChain.js';

const chatHistory: [string, string][] = [];

marked.setOptions({
  // Define custom renderer
  renderer: new TerminalRenderer(),
});

const displayWelcomeMessage = () => {
  console.log(chalk.bold.blue(`Welcome to the Chatbot CLI Tool!`));
  console.log(
    `Ask any questions related to the topic, and the chatbot will try to help you. Type 'exit' to quit the chatbot.\n`,
  );
};

const clearScreenAndMoveCursorToTop = () => {
  process.stdout.write('\x1B[2J\x1B[0f');
};

export const query = async ({ name, repositoryUrl, output }: AutodocConfig) => {
  const data = path.join(output, 'docs', 'data/');
  const vectorStore = await HNSWLib.load(data, new OpenAIEmbeddings());
  const chain = makeChain(name, repositoryUrl, vectorStore, (token: string) => {
    process.stdout.write(token);
  });

  clear(); // Clear the terminal screen
  clearScreenAndMoveCursorToTop();
  displayWelcomeMessage();

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
    } catch (error: any) {
      console.log(chalk.red(`Something went wrong: ${error.message}`));
      question = await getQuestion();
    }
  }
};
