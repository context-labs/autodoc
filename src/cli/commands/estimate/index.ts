import fs from 'node:fs/promises';
import path from 'node:path';
import { OpenAIChat } from 'langchain/llms';
import { encoding_for_model } from '@dqbd/tiktoken';
import { APIRateLimit } from '../../utils/APIRateLimit.js';
import {
  createCodeFileSummary,
  createCodeQuestions,
  folderSummaryPrompt,
} from './prompts.js';
import {
  AutodocConfig,
  FileSummary,
  FolderSummary,
  LLMModelDetails,
  LLMModels,
  ProcessFile,
  ProcessFolder,
} from '../../../types.js';
import { traverseFileSystem } from '../../utils/traverseFileSystem.js';
import {
  spinnerSuccess,
  stopSpinner,
  updateSpinnerText,
} from '../../spinner.js';
import {
  getFileName,
  githubFileUrl,
  githubFolderUrl,
} from '../../utils/FileUtil.js';
import { models, printModelDetails } from '../../utils/LLMUtil.js';

export const estimate = async ({
  name: projectName,
  repositoryUrl,
  root: inputRoot,
  output: outputRoot,
  llms,
  ignore,
}: AutodocConfig) => {
  const encoding = encoding_for_model('gpt-3.5-turbo');

  const filesAndFolders = async (): Promise<{
    files: number;
    folders: number;
  }> => {
    let files = 0;
    let folders = 0;

    await Promise.all([
      traverseFileSystem({
        inputPath: inputRoot,
        projectName,
        processFile: () => {
          files++;
          return Promise.resolve();
        },
        ignore,
      }),
      traverseFileSystem({
        inputPath: inputRoot,
        projectName,
        processFolder: () => {
          folders++;
          return Promise.resolve();
        },
        ignore,
      }),
    ]);

    return {
      files,
      folders,
    };
  };

  const { files, folders } = await filesAndFolders();
};
