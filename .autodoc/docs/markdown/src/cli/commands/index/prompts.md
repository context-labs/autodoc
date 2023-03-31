[View code on GitHub](https://github.com/context-labs/autodoc/src\cli\commands\index\prompts.ts)

This code defines three utility functions that generate prompts for documentation experts working on a project. These functions are used to create documentation for code files and folders within a project. The generated prompts are in markdown format and include specific instructions for the documentation expert.

1. `createCodeFileSummary`: This function generates a prompt for creating a summary of a code file. It takes five parameters: `filePath`, `projectName`, `fileContents`, `contentType`, and `filePrompt`. The function returns a markdown formatted string that includes the file's content and a custom prompt for the documentation expert.

Example usage:
```javascript
const prompt = createCodeFileSummary('path/to/file.js', 'MyProject', 'const x = 10;', 'JavaScript', 'Write a detailed technical explanation of this code.');
```

2. `createCodeQuestions`: This function generates a prompt for creating a list of questions and answers about a code file. It takes five parameters: `filePath`, `projectName`, `fileContents`, `contentType`, and `targetAudience`. The function returns a markdown formatted string that includes the file's content and a custom prompt for the documentation expert to provide questions and answers.

Example usage:
```javascript
const prompt = createCodeQuestions('path/to/file.js', 'MyProject', 'const x = 10;', 'JavaScript', 'beginner');
```

3. `folderSummaryPrompt`: This function generates a prompt for creating a summary of a folder containing code files and subfolders. It takes six parameters: `folderPath`, `projectName`, `files`, `folders`, `contentType`, and `folderPrompt`. The `files` parameter is an array of `FileSummary` objects, and the `folders` parameter is an array of `FolderSummary` objects. The function returns a markdown formatted string that includes a list of files and folders with their summaries and a custom prompt for the documentation expert.

Example usage:
```javascript
const prompt = folderSummaryPrompt('path/to/folder', 'MyProject', fileSummaries, folderSummaries, 'JavaScript', 'Write a detailed technical explanation of this folder structure.');
```

These functions can be used in the larger project to generate documentation tasks for experts, ensuring consistent formatting and instructions across different parts of the project.
## Questions: 
 1. **What is the purpose of the `createCodeFileSummary` function?**

   The `createCodeFileSummary` function generates a string template for a code file summary prompt, which includes the file path, project name, file contents, content type, and a file prompt.

2. **How does the `createCodeQuestions` function differ from the `createCodeFileSummary` function?**

   The `createCodeQuestions` function generates a string template for a code documentation prompt that asks for 3 questions and their answers, while the `createCodeFileSummary` function generates a string template for a code file summary prompt.

3. **What is the role of the `folderSummaryPrompt` function?**

   The `folderSummaryPrompt` function generates a string template for a folder summary prompt, which includes the folder path, project name, lists of files and folders with their summaries, content type, and a folder prompt.