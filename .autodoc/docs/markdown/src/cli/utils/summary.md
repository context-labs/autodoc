[View code on GitHub](https://github.com/context-labs/autodoc/.autodoc/docs/json/src/cli/utils)

The code in the `.autodoc/docs/json/src/cli/utils` folder provides utility functions and classes that help manage various aspects of the autodoc project, such as rate-limiting API calls, handling file and folder paths, managing language models, and traversing file systems.

`APIRateLimit.ts` contains the `APIRateLimit` class, which is designed to manage and limit the number of concurrent API calls made by the application. This is useful when the API being called has a rate limit or when the application needs to control the number of simultaneous requests to avoid overloading the server. For example:

```javascript
const apiRateLimiter = new APIRateLimit(10); // Limit to 10 concurrent calls
async function getData(id) {
  return apiRateLimiter.callApi(() => fetchData(id));
}
getData(1).then(console.log); // Fetches data for ID 1, rate-limited
```

`FileUtil.ts` provides utility functions for handling file and folder paths, such as generating file names and GitHub URLs for files and folders. These functions can be used to manage and navigate the documentation structure. For example:

```javascript
getFileName("example.txt"); // returns "example.md"
githubFileUrl("https://github.com/user/repo", "/input", "/input/example.md", true); // returns "https://github.com/user/repo/example.md"
```

`LLMUtil.ts` defines and manages different language models (LLMs) and their associated costs for a project. It provides functions like `printModelDetails` and `totalIndexCostEstimate` to manage and analyze the usage and costs of different language models. For example, the `printModelDetails` function can provide a summary of the project's LLM usage, while the `totalIndexCostEstimate` function can help estimate the overall cost of using these models.

`WaitUtil.ts` provides two utility functions, `wait` and `forTrue`, which help manage asynchronous operations in the larger project. They can be used in various parts of the project to handle timing and conditional logic in an asynchronous manner. For example:

```javascript
wait(2000, "Hello, world!").then(console.log); // Waits for 2 seconds and then logs "Hello, world!"
forTrue(isElementVisible).then(() => console.log("Element is visible!")); // Waits for an element to become visible, then logs "Element is visible!"
```

`traverseFileSystem.ts` contains the `traverseFileSystem` function, which recursively traverses a given file system, processes folders and files, and filters out ignored files based on provided patterns. It is designed to be used for processing and generating documentation for a given project. For example:

```javascript
const params = {
  inputPath: './myProject',
  projectName: 'My Project',
  ignore: ['node_modules/**', '.git/**'],
  processFile: async (fileInfo) => {
    // Process the file, e.g., generate documentation
  },
  processFolder: async (folderInfo) => {
    // Process the folder, e.g., create a folder in the output directory
  },
};
traverseFileSystem(params);
```

In summary, the code in this folder provides various utility functions and classes that help manage different aspects of the autodoc project, making it easier to handle tasks such as rate-limiting, file and folder management, language model management, asynchronous operations, and file system traversal.
