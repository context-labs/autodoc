[View code on GitHub](https://github.com/context-labs/autodoc/tree/master/.autodoc/docs/json/src/cli/commands/query)

The `query` folder in the `autodoc` project contains code for creating a chatbot that can answer technical questions related to a software project. The chatbot is designed to be an AI assistant for a software project and is trained on all the code that makes up the project.

The main file in this folder is `index.ts`, which exports a `query` function. This function takes two arguments: `AutodocRepoConfig` and `AutodocUserConfig`. The `AutodocRepoConfig` object contains information about the repository, such as the name and URL, while the `AutodocUserConfig` object contains information about the user, such as their preferred language model.

The chatbot uses the `inquirer` package to prompt the user for a question related to the codebase. It then uses the `makeChain` function from the `createChatChain.ts` file to generate a response to the question. The `makeChain` function takes in the name of the repository, the repository URL, a vector store, a language model, and a callback function. It returns a function that can be called with a question and chat history, and it generates a response to the question using the vector store and language model.

The chatbot displays the response to the user using the `marked` package to format the response as Markdown. It also keeps track of the chat history in an array called `chatHistory`.

The chatbot runs in a loop until the user types "exit". It prompts the user for a question, generates a response, displays the response, and repeats until the user types "exit".

Example usage:

```javascript
import { query } from 'autodoc';

const repoConfig = {
  name: 'my-project',
  repositoryUrl: 'https://github.com/my-username/my-project',
  output: '/path/to/output',
};

const userConfig = {
  llms: 'en',
};

query(repoConfig, userConfig);
```

This will start the chatbot for the `my-project` repository using the English language model. The user can then ask questions related to the codebase, and the chatbot will generate responses.

The `createChatChain.ts` file contains the `makeChain` function, which is responsible for creating the chatbot. It uses several libraries and models, including `langchain/llms`, `langchain/chains`, `langchain/prompts`, `langchain/hnswlib.js`, and `types.js`. The function creates a `ChatVectorDBQAChain` object using the vector store, a `questionGenerator` object, and a `docChain` object. The `docChain` object is created using the `loadQAChain` function and an `OpenAIChat` object, which is used to generate responses to questions using the LLM model and a `QA_PROMPT` template.
