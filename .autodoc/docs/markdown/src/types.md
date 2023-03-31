[View code on GitHub](https://github.com/context-labs/autodoc/src\types.ts)

This code defines the types and interfaces for the `autodoc` project, which aims to automatically generate documentation for a given code repository. The project uses OpenAI's language models (LLMs) to process and generate summaries, questions, and other relevant information for files and folders in the repository.

The `AutodocUserConfig` and `AutodocRepoConfig` types define the configuration options for the user and repository, respectively. These include settings such as the LLM models to use, repository URL, output directory, and content type.

`FileSummary` and `FolderSummary` types represent the generated summaries for files and folders, including their paths, URLs, and checksums. The `ProcessFileParams` and `ProcessFolderParams` types define the parameters required for processing files and folders, such as the file or folder name, path, and content type.

`ProcessFile` and `ProcessFolder` are function types that take the respective parameters and return a promise. These functions are responsible for processing the files and folders, generating summaries, and updating the documentation.

`TraverseFileSystemParams` type defines the parameters for traversing the file system, including the input path, project name, and optional `processFile` and `processFolder` functions. It also includes settings for ignoring certain files or folders and content type preferences.

The `LLMModels` enum lists the available language models, such as GPT-3.5 Turbo, GPT-4, and GPT-4 32k. The `LLMModelDetails` type provides information about each model, including the cost per 1K tokens, maximum length, and success/failure statistics.

In the larger project, these types and interfaces would be used to configure and run the `autodoc` tool, allowing users to automatically generate documentation for their code repositories using OpenAI's language models. For example, a user could provide an `AutodocRepoConfig` object to configure the tool, and then use the `TraverseFileSystem` function to process the repository and generate the documentation.
## Questions: 
 1. **What is the purpose of the `AutodocUserConfig` and `AutodocRepoConfig` types?**

   The `AutodocUserConfig` type is used to define the user configuration for the autodoc project, which includes an array of LLMModels. The `AutodocRepoConfig` type is used to define the repository configuration for the autodoc project, which includes various properties such as name, repository URL, root, output, LLMModels, and more.

2. **What are the different LLMModels available in the `LLMModels` enum?**

   The `LLMModels` enum lists the available language models for the autodoc project. Currently, there are three models: GPT3 (gpt-3.5-turbo), GPT4 (gpt-4), and GPT432k (gpt-4-32k).

3. **What is the purpose of the `ProcessFile` and `ProcessFolder` types?**

   The `ProcessFile` type is a function type that takes a `ProcessFileParams` object as input and returns a Promise. It is used to process a single file in the autodoc project. The `ProcessFolder` type is a function type that takes a `ProcessFolderParams` object as input and returns a Promise. It is used to process a folder in the autodoc project.