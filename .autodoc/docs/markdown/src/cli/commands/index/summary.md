[View code on GitHub](https://github.com/context-labs/autodoc/tree/master/.autodoc/docs/json/src/cli/commands/index)

The code in this folder is responsible for generating documentation for a given repository using the Autodoc project. It processes the repository, converts JSON files to markdown, and creates a vector store for efficient similarity search between documents.

`convertJsonToMarkdown.ts` contains the `convertJsonToMarkdown` function that converts JSON files to markdown files. It takes an object with properties `name`, `root`, and `output`. The function counts the number of files in the project, creates markdown files for each code file, and updates the spinner text to indicate progress. The markdown content includes a link to the file on GitHub, the summary, and any questions related to the file.

Example usage:

```typescript
import { convertJsonToMarkdown } from 'autodoc';

const config = {
  name: 'my-repo',
  root: '/path/to/my/repo',
  output: '/path/to/output/directory',
};

convertJsonToMarkdown(config);
```

`createVectorStore.ts` is responsible for creating a vector store for a set of documents. The input is a directory containing the documents to be indexed, and the output is a file containing the vector store. The code imports several modules from the `langchain` package and uses them to process the documents, generate embeddings, and create a vector store.

Example usage:

```typescript
import { createVectorStore } from 'autodoc';

const config = {
  root: '/path/to/documents',
  output: '/path/to/vectorstore.bin',
};

createVectorStore(config)
  .then(() => console.log('Vector store created successfully'))
  .catch((err) => console.error('Error creating vector store:', err));
```

`index.ts` serves as the entry point for generating documentation for a given repository. It sets up paths for JSON, markdown, and data directories, calls `processRepository` to traverse the repository and create JSON files, `convertJsonToMarkdown` to create markdown files, and `createVectorStore` to create vector files.

Example usage:

```typescript
import autodoc from 'autodoc';

const config = {
  name: 'my-repo',
  repositoryUrl: 'https://github.com/my-username/my-repo',
  root: '/path/to/my/repo',
  output: '/path/to/output/directory',
  llms: true,
  ignore: ['node_modules', 'dist'],
};

autodoc.index(config);
```

`processRepository.ts` contains the `processRepository` function that processes a given repository and generates documentation for its code files. It initializes an encoding for the GPT language model, defines sub-functions `processFile` and `processFolder`, and traverses the file system to process code files and folders.

`prompts.ts` provides three functions for generating prompts and documentation for the Autodoc project: `createCodeFileSummary`, `createCodeQuestions`, and `folderSummaryPrompt`. These functions generate summaries and questions for code files and folders, which can be used to create more thorough documentation and understanding of the project.

Example usage:

```typescript
import { createCodeFileSummary } from 'autodoc';

const filePath = 'src/components/Button.js';
const projectName = 'My Awesome Project';
const fileContents = `
  import React from 'react';

  const Button = ({ text, onClick }) => {
    return (
      <button onClick={onClick}>{text}</button>
    );
  };

  export default Button;
`;

const fileSummary = createCodeFileSummary(filePath, projectName, fileContents);
console.log(fileSummary);
```

Overall, this folder contains code that can be used to generate documentation for a given repository, which can help developers understand and navigate the project more easily.
