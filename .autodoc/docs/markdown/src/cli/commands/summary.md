[View code on GitHub](https://github.com/context-labs/autodoc/tree/master/.autodoc/docs/json/src/cli/commands)

The `src/cli/commands` folder contains code for various command-line interface (CLI) commands used in the Autodoc project. These commands help users interact with the project, such as initializing configurations, generating documentation, and querying the generated documentation.

### estimate

The `estimate` command estimates the cost of indexing a given repository within the Autodoc project. It takes an object with properties such as the repository name, URL, root directory, output directory, and optional parameters.

```javascript
import { estimate } from 'autodoc';

estimate({
  name: 'my-repo',
  repositoryUrl: 'https://github.com/my-username/my-repo.git',
  root: '/path/to/repo',
  output: '/path/to/output',
  llms: true,
  ignore: ['node_modules', 'dist'],
});
```

### index

The `index` command generates documentation for a given repository using the Autodoc project. It processes the repository, converts JSON files to markdown, and creates a vector store for efficient similarity search between documents.

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

### init

The `init` command initializes the Autodoc project with user-specified or default configuration options.

```bash
autodoc init
```

Or with custom options:

```bash
autodoc init --name=my-repo --repositoryUrl=https://github.com/my-username/my-repo
```

### query

The `query` command creates a chatbot that can answer technical questions related to a software project. The chatbot is designed to be an AI assistant for a software project and is trained on all the code that makes up the project.

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

### user

The `user` command handles user configuration of the Autodoc tool. It prompts the user to select which LLMs they have access to and writes the resulting configuration to a file.

```javascript
import { user } from 'autodoc';

const config = {
  llms: 'en',
};

user(config);
```

In summary, the `src/cli/commands` folder contains code for various CLI commands that help users interact with the Autodoc project. These commands provide functionality such as initializing configurations, generating documentation, querying the generated documentation, and handling user configurations.
