[View code on GitHub](https://github.com/context-labs/autodoc/tree/master/.autodoc/docs/json/src/cli/utils)

The `src/cli/utils` folder contains utility functions and classes that are designed to assist the `autodoc` project in various tasks such as limiting API calls, generating URLs for files and folders, managing language models, and traversing file systems.

The `APIRateLimit.ts` file defines a class that limits the number of concurrent API calls made by an application. It queues up API calls that exceed the maximum number of concurrent calls allowed and executes them as soon as there are available slots. This class can be used to ensure that API calls are made efficiently and without overwhelming the API server.

```javascript
const apiRateLimit = new APIRateLimit(10);

async function makeApiCall() {
  const result = await apiRateLimit.callApi(() => {
    return fetch('https://api.example.com/data');
  });
  console.log(result);
}

makeApiCall();
```

The `FileUtil.ts` file provides functions for generating URLs for files and folders in a GitHub repository. These functions can be used to create links that point to the correct location in the repository.

```javascript
const fileUrl = githubFileUrl("https://github.com/user/repo", "/path/to/files", "/path/to/files/docs/index.md");
const folderUrl = githubFolderUrl("https://github.com/user/repo", "/path/to/files", "/path/to/files/docs");
```

The `LLMUtil.ts` file defines a set of language models and provides functions to print details about the models and estimate the cost of using them. This code can be used to manage the cost and usage of language models in the `autodoc` project.

```javascript
printModelDetails(modelsArray);
const cost = totalIndexCostEstimate(modelsArray);
```

The `WaitUtil.ts` file contains two functions, `wait` and `forTrue`, that are designed to be used in asynchronous programming to control the flow of execution in a program.

```javascript
async function example() {
  console.log('start');
  await wait(1000);
  console.log('end');
}

example();
```

The `traverseFileSystem.ts` file defines a utility function that recursively traverses a file system starting from a given input path. This function can be used in the larger `autodoc` project to recursively traverse a project directory and process each file and folder according to the needs of the project.

```javascript
await traverseFileSystem({
  inputPath: '/path/to/project',
  projectName: 'My Project',
  processFile,
  processFolder,
  ignore,
});
```

Overall, the utility functions and classes in the `src/cli/utils` folder provide essential functionality that can be used in conjunction with other parts of the `autodoc` project to achieve various tasks such as API call management, URL generation, language model management, and file system traversal.
