[View code on GitHub](https://github.com/context-labs/autodoc/.autodoc\docs\json\src\cli\utils)

The `.autodoc\docs\json\src\cli\utils` folder contains utility functions and classes that assist in managing API rate limits, handling file and folder paths, managing language models, traversing file systems, and controlling asynchronous operations. These utilities can be used throughout the autodoc project to ensure consistent behavior and improve code organization.

`APIRateLimit.ts` provides the `APIRateLimit` class, which manages and limits the number of concurrent API calls made by the application. This is useful when working with rate-limited APIs or preventing server overload. Example usage:

```javascript
const apiRateLimiter = new APIRateLimit(10); // Limit to 10 concurrent calls
async function fetchSomeData(id) {
  const result = await apiRateLimiter.callApi(() => fetch(`https://api.example.com/data/${id}`));
  return result;
}
```

`FileUtil.ts` offers utility functions for generating file names and GitHub URLs for documentation files. These functions ensure consistent naming and URL generation across the project. Example usage:

```javascript
getFileName('example.txt'); // returns 'example.md'
githubFileUrl('https://github.com/user/repo', '/input', '/input/example.md', true); // returns 'https://github.com/user/repo/example.md'
```

`LLMUtil.ts` defines and manages different language models (LLMs) and their associated costs for a project utilizing OpenAI's GPT models. Functions like `printModelDetails` and `totalIndexCostEstimate` can be used to manage and analyze the usage and costs of different LLMs. Example usage:

```javascript
import { models, printModelDetails } from './path/to/this/file';
printModelDetails(Object.values(models));
const totalCost = totalIndexCostEstimate(Object.values(models));
console.log(`Total cost: ${totalCost}`);
```

`traverseFileSystem.ts` contains the `traverseFileSystem` function, which recursively traverses a given file system, processing files and folders based on provided parameters. This is useful for generating documentation or performing tasks that require processing files and folders in a directory structure. Example usage:

```javascript
await traverseFileSystem({
  inputPath: './src',
  projectName: 'myProject',
  processFile: (params) => { /* Process file logic */ },
  processFolder: (params) => { /* Process folder logic */ },
  ignore: ['node_modules/**', '.git/**'],
});
```

`WaitUtil.ts` provides two utility functions, `wait` and `forTrue`, which help manage asynchronous operations by introducing delays and waiting for specific conditions to be met. These functions can be used to control the flow of asynchronous code execution. Example usage:

```javascript
async function delayedEcho() {
  console.log("Start");
  await wait(1000, "Hello");
  console.log("End");
}

async function waitForCondition() {
  console.log("Waiting for condition...");
  await forTrue(() => condition);
  console.log("Condition met!");
}
```

In summary, the utilities in this folder enhance the autodoc project by providing consistent behavior, improving code organization, and managing various aspects of the project, such as API rate limits, file and folder paths, language models, file system traversal, and asynchronous operations.
