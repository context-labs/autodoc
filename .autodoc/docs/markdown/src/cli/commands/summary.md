[View code on GitHub](https://github.com/context-labs/autodoc/.autodoc\docs\json\src\cli\commands)

The code in the `.autodoc\docs\json\src\cli\commands` folder is responsible for various tasks related to the Autodoc project, such as initializing the configuration, processing repositories, generating documentation, and creating a chatbot for answering questions about a specific software project. The folder contains several subfolders, each with a specific purpose.

### estimate

The `estimate` function provides an estimated cost of processing a given repository. It takes an `AutodocRepoConfig` object as input and performs a dry run of the repository processing to calculate the estimated cost. Example usage:

```javascript
import { estimate } from './path/to/this/file';

const config = {
  name: 'my-repo',
  repositoryUrl: 'https://github.com/user/my-repo.git',
  root: './',
  output: './output',
  llms: ['en'],
  ignore: ['.git', 'node_modules'],
  filePrompt: true,
  folderPrompt: true,
  chatPrompt: true,
  contentType: 'code',
  targetAudience: 'developers',
  linkHosted: true,
};

estimate(config);
```

### index

The code in this folder processes a given repository and generates documentation in JSON, Markdown, and vector formats. It takes an `AutodocRepoConfig` object as input and performs three main tasks: processing the repository, creating Markdown files, and creating vector files. Example usage:

```javascript
index({
  name: "myProject",
  root: "./input",
  output: "./output",
  filePrompt: true,
  folderPrompt: true,
  contentType: "code",
  targetAudience: "developers",
  linkHosted: "https://github.com/user/myProject",
});
```

### init

The `init` function initializes the configuration of the Autodoc project. It prompts the user to input necessary information to set up the project and creates the `autodoc.config.json` file in the project root. Example usage:

```javascript
import { init } from './path/to/this/file';

// Initialize the configuration with default values
await init();

// Initialize the configuration with custom values
await init({
  name: 'My Custom Repository',
  repositoryUrl: 'https://github.com/user/repo',
});
```

### query

The `query` folder contains code for creating a chatbot that can answer questions about a specific software project. The main entry point is the `query` function, which takes an `AutodocRepoConfig` object and an `AutodocUserConfig` object as input. Example usage:

```javascript
import { query } from './autodoc';

const repoConfig = {
  name: 'MyProject',
  repositoryUrl: 'https://github.com/user/myproject',
  output: 'path/to/output',
  contentType: 'code',
  chatPrompt: 'Ask me anything about MyProject',
  targetAudience: 'developers',
};

const userConfig = {
  llms: 'path/to/llms',
};

query(repoConfig, userConfig);
```

### user

The `user` folder manages the user configuration for the Autodoc project. It allows users to create, update, and save their configuration file, which stores information about their access to different Language Learning Models (LLMs). Example usage:

```javascript
import { user } from './path/to/this/file';

// Create a new user configuration with default settings
await user();

// Update the user configuration with a custom config object
await user({ llms: [LLMModels.GPT3, LLMModels.GPT4] });
```

In summary, the code in this folder is essential for various tasks related to the Autodoc project, such as initializing the configuration, processing repositories, generating documentation, and creating a chatbot for answering questions about a specific software project.
