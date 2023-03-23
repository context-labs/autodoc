"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.folderSummaryPrompt = exports.createCodeQuestions = exports.createCodeFileSummary = void 0;
const createCodeFileSummary = (filePath, projectName, fileContents) => {
    return `
    You are acting as a code documentation expert for a project called ${projectName}.
    Below is the code from a file located at \`${filePath}\`. 
    Write a detailed technical explanation of what this code does. 
    Focus on the high-level purpose of the code and how it may be used in the larger project.
    Include code examples where appropriate. Keep you response between 100 and 300 words. 
    DO NOT RETURN MORE THAN 300 WORDS.
    Output should be in markdown format. 
    Do not say "this file is a part of the ${projectName} project".
    Do not just list the methods and classes in this file.

    Code:
    ${fileContents}

    Response:

  `;
};
exports.createCodeFileSummary = createCodeFileSummary;
const createCodeQuestions = (filePath, projectName, fileContents) => {
    return `
    You are acting as a code documentation expert for a project called ${projectName}.
    Below is the code from a file located at \`${filePath}\`. 
    What are 3 questions that a super smart developer might have about this code? 
    Answer each question in 1-2 sentences. Output should be in markdown format.

    Code:
    ${fileContents}

    Questions and Answers:
    
  `;
};
exports.createCodeQuestions = createCodeQuestions;
const folderSummaryPrompt = (folderPath, projectName, files, folders) => {
    return `
    You are acting as a code documentation expert for a project called ${projectName}.
    You are currently documenting the folder located at \`${folderPath}\`. 
    
    Below is a list of the files in this folder and a summary of the contents of each file:

    ${files.map((file) => {
        return `
        Name: ${file.fileName}
        Summary: ${file.summary}    

      `;
    })}

    And here is a list of the subfolders in this folder and a summary of the contents of each subfolder:

    ${folders.map((folder) => {
        return `
        Name: ${folder.folderName}
        Summary: ${folder.summary}    

      `;
    })}


    Write a technical explanation of what the code in this file does
    and how it might fit into the larger project or work with other parts of the project.
    Give examples of how this code might be used. Include code examples where appropriate.
    Be concise. Include any information that may be relevant to a developer who is curious about this code.
    Keep you response under 400 words. Output should be in markdown format.
    Do not say "this file is a part of the ${projectName} project".
    Do not just list the files and folders in this folder.


    Response:
  `;
};
exports.folderSummaryPrompt = folderSummaryPrompt;
//# sourceMappingURL=prompts.js.map