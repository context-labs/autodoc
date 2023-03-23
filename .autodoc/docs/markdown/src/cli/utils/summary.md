[View code on GitHub](https://github.com/context-labs/autodoc/tree/master/.autodoc/docs/json/src/cli/utils)

The code in this folder provides utility functions and classes to manage various aspects of the Clockwork project, such as rate limiting API calls, handling file and folder paths, managing language models, and traversing file systems.

`APIRateLimit.ts` contains the `APIRateLimit` class, which manages and limits the number of concurrent API calls made by the application. This is useful when the API being called has a rate limit or when the application needs to prevent overwhelming the server with too many requests at once. For example:

```javascript
const apiRateLimiter = new APIRateLimit(10); // Limit to 10 concurrent calls
async function fetchData(id) { /* ... */ }
async function getData(ids) { /* ... */ }
getData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
```

`FileUtil.ts` provides utility functions for handling file and folder paths, particularly useful for generating URLs to access files and folders on GitHub. Example usage:

```javascript
const fileName = getFileName("example.txt", ".", ".md");
const fileUrl = githubFileUrl("https://github.com/user/repo", "src", "src/example.md");
const folderUrl = githubFolderUrl("https://github.com/user/repo", "src", "src/folder");
```

`LLMUtil.ts` defines and manages different language models (LLMs) used in the project. It imports the `OpenAIChat` class and provides the `printModelDetails` function to print a summary table of the LLMs' usage statistics. Example usage:

```javascript
import { models, printModelDetails } from './clockwork';
models[LLMModels.GPT3].llm.chat('What is the meaning of life?');
printModelDetails(Object.values(models));
```

`WaitUtil.ts` provides two utility functions, `wait` and `forTrue`, that help manage asynchronous operations in the project by introducing delays and waiting for specific conditions to be met. Example usage:

```javascript
await wait(1000);
console.log("This will be printed after 1 second");

await forTrue(isDataReady);
console.log("Data is ready, proceed with processing");
```

`traverseFileSystem.ts` contains the `traverseFileSystem` function, which recursively traverses a given file system, processing files and folders based on the provided callback functions, while ignoring files and folders that match any pattern in the `ignore` array. Example usage:

```javascript
await traverseFileSystem({
  inputPath: './src',
  projectName: 'myProject',
  processFile: ({ fileName, filePath, projectName }) => { /* ... */ },
  processFolder: ({ folderName, folderPath, projectName, shouldIgnore }) => { /* ... */ },
  ignore: ['node_modules/**', '.git/**'],
});
```

These utility functions and classes can be used throughout the Clockwork project to manage various aspects of the project, such as rate limiting, file handling, language model management, and file system traversal.
