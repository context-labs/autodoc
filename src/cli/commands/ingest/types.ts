import { OpenAIChat } from 'langchain/llms';

export type FileSummary = {
  fileName: string;
  filePath: string;
  githubUrl: string;
  summary: string;
  questions: string;
};

export type ProcessFileParams = {
  fileName: string;
  filePath: string;
  projectName: string;
};

export type ProcessFile = (params: ProcessFileParams) => Promise<FileSummary>;

export type FolderSummary = {
  folderName: string;
  folderPath: string;
  githubUrl: string;
  files: FileSummary[];
  folders: FolderSummary[];
  summary: string;
  questions: string;
};

export type ProcessFolderParams = {
  folderName: string;
  folderPath: string;
  projectName: string;
  shouldIgnore: (fileName: string) => boolean;
};

export type ProcessFolder = (
  params: ProcessFolderParams,
) => Promise<FolderSummary>;

export type CreateMarkdownParams = {
  inputPath: string;
  outputPath: string;
  projectName: string;
  processFile: ProcessFile;
  processFolder: ProcessFolder;
  ignored: string[];
};

export enum LLMModels {
  GPT3 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4',
  GPT432k = 'gpt-4-32k',
}

export type LLMModelDetails = {
  name: LLMModels;
  inputCostPer1KTokens: number;
  outputCostPer1KTokens: number;
  maxLength: number;
  llm: OpenAIChat;
  inputTokens: number;
  outputTokens: number;
  succeeded: number;
  failed: number;
  total: number;
};
