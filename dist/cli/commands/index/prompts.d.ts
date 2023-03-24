import { FileSummary, FolderSummary } from '../../../types.js';
export declare const createCodeFileSummary: (filePath: string, projectName: string, fileContents: string) => string;
export declare const createCodeQuestions: (filePath: string, projectName: string, fileContents: string) => string;
export declare const folderSummaryPrompt: (folderPath: string, projectName: string, files: FileSummary[], folders: FolderSummary[]) => string;
