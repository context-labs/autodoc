import fs from 'fs/promises';
import path from 'path';
import { OpenAIChat } from 'langchain/llms';
import { encoding_for_model } from '@dqbd/tiktoken';
import { APIRateLimit } from '../../utils/APIRateLimit';
import {
  createCodeFileSummary,
  createCodeQuestions,
  folderSummaryPrompt,
} from './prompts';
import {
  AutodocConfig,
  FileSummary,
  FolderSummary,
  LLMModelDetails,
  LLMModels,
  ProcessFile,
  ProcessFolder,
} from '../../../types';
import { traverseFileSystem } from '../../utils/traverseFileSystem';

const models: Record<LLMModels, LLMModelDetails> = {
  [LLMModels.GPT3]: {
    name: LLMModels.GPT3,
    inputCostPer1KTokens: 0.002,
    outputCostPer1KTokens: 0.002,
    maxLength: 3050,
    llm: new OpenAIChat({
      temperature: 0.1,
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: LLMModels.GPT3,
    }),
    inputTokens: 0,
    outputTokens: 0,
    succeeded: 0,
    failed: 0,
    total: 0,
  },
  [LLMModels.GPT4]: {
    name: LLMModels.GPT4,
    inputCostPer1KTokens: 0.03,
    outputCostPer1KTokens: 0.06,
    maxLength: 8192,
    llm: new OpenAIChat({
      temperature: 0.1,
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: LLMModels.GPT4,
    }),
    inputTokens: 0,
    outputTokens: 0,
    succeeded: 0,
    failed: 0,
    total: 0,
  },
  [LLMModels.GPT432k]: {
    name: LLMModels.GPT432k,
    inputCostPer1KTokens: 0.06,
    outputCostPer1KTokens: 0.12,
    maxLength: 32768,
    llm: new OpenAIChat({
      temperature: 0.1,
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: LLMModels.GPT4,
    }),
    inputTokens: 0,
    outputTokens: 0,
    succeeded: 0,
    failed: 0,
    total: 0,
  },
};

const printModel = (model: LLMModelDetails): void => {
  console.log('\n');
  console.log(`Model: ${model.name}`);
  console.log('--------------------');
  console.log(`Succeeded: ${model.succeeded}`);
  console.log(`Failed: ${model.failed}`);
  console.log(`Total: ${model.total}`);
  console.log(`Input Tokens: ${model.inputTokens}`);
  console.log(
    `Input Tokens Cost: $${
      (model.inputTokens / 1000) * model.inputCostPer1KTokens
    }`,
  );
  console.log(`Ouput Tokens: ${model.outputTokens}`);
  console.log(
    `Output Tokens Cost: $${
      (model.outputTokens / 1000) * model.outputCostPer1KTokens
    }`,
  );
  console.log('--------------------');
  console.log('\n');
};

function getFileName(
  input: string,
  delimiter = '.',
  extension = '.md',
): string {
  const lastDelimiterIndex = input.lastIndexOf(delimiter);
  if (lastDelimiterIndex === -1) {
    // delimiter not found in string
    return input + extension;
  } else {
    return input.slice(0, lastDelimiterIndex) + extension;
  }
}
export const processRepository = async ({
  name: projectName,
  url: githubRoot,
  root: inputRoot,
  output: outputRoot,
  llms,
}: AutodocConfig) => {
  const encoding = encoding_for_model('gpt-3.5-turbo');
  const skipped = 0;

  const rateLimit = new APIRateLimit();

  const callLLM = async (
    prompt: string,
    model: OpenAIChat,
  ): Promise<string> => {
    return rateLimit.callApi(() => model.call(prompt));
  };

  const githubFileUrl = (filePath: string): string => {
    return `${githubRoot}/blob/master/${filePath.substring(
      inputRoot.length - 1,
    )}`;
  };

  const githubFolderUrl = (folderPath: string): string => {
    return `${githubRoot}/tree/master/${folderPath.substring(
      inputRoot.length - 1,
    )}`;
  };

  const processFile: ProcessFile = async ({
    fileName,
    filePath,
    projectName,
  }): Promise<void> => {
    const content = await fs.readFile(filePath, 'utf-8');
    const markdownFilePath = path.join(outputRoot, filePath);

    // Create the output directory if it doesn't exist
    try {
      await fs.mkdir(markdownFilePath.replace(fileName, ''), {
        recursive: true,
      });
    } catch (error) {
      console.error(error);
      return;
    }

    const githubUrl = githubFileUrl(filePath);
    const summaryPrompt = createCodeFileSummary(
      filePath.substring(5),
      projectName,
      content,
    );
    const questionsPrompt = createCodeQuestions(
      filePath.substring(5),
      projectName,
      content,
    );
    const summaryLength = encoding.encode(summaryPrompt).length;
    const questionLength = encoding.encode(questionsPrompt).length;
    const max = Math.max(questionLength, summaryLength);

    const model: LLMModelDetails | null = (() => {
      if (models[LLMModels.GPT4].maxLength > max) {
        return models[LLMModels.GPT4];
      } else if (models[LLMModels.GPT432k].maxLength > max) {
        return models[LLMModels.GPT432k];
      } else {
        return null;
      }
    })();

    try {
      if (model === null) {
        // skipped++;
        console.log(`Skipped ${filePath} | Length ${max}`);
        return;
      }

      // console.log(`${model.name} -> ${filePath} | Length ${max}`);
      // model.inputTokens += summaryLength + questionLength;
      // model.total++;

      // const [summary, questions] = await Promise.all([
      //   callLLM(summaryPrompt, model.llm),
      //   callLLM(questionsPrompt, model.llm),
      // ]);

      // model.outputTokens +=
      //   encoding.encode(summary).length + encoding.encode(questions).length;
      // model.succeeded++;

      const file = {
        fileName,
        filePath,
        githubUrl,
        summary: '',
        questions: '',
      };

      const outputPath = getFileName(markdownFilePath, '.', '.json');
      const content =
        file.summary.length > 0 ? JSON.stringify(file, null, 2) : '';
      await fs.writeFile(outputPath, JSON.stringify(content), 'utf-8');
    } catch (e) {
      console.log(e);
      console.error(`Failed to get summary for file ${fileName}`);
      // model.failed++;
    }
  };

  const processFolder: ProcessFolder = async ({
    folderName,
    folderPath,
    projectName,
    shouldIgnore,
  }): Promise<void> => {
    const contents = (await fs.readdir(folderPath)).filter(
      (fileName) => !shouldIgnore(fileName),
    );
    const githubUrl = githubFolderUrl(folderPath);
    const allFiles: (FileSummary | null)[] = await Promise.all(
      contents.map(async (fileName) => {
        const entryPath = path.join(folderPath, fileName);
        const entryStats = await fs.stat(entryPath);

        if (entryStats.isFile() && fileName !== 'summary.json') {
          const file = await fs.readFile(entryPath, 'utf8');
          return file.length > 0 ? JSON.parse(file) : null;
        }

        return null;
      }),
    );

    try {
      const files = allFiles.filter(
        (file): file is FileSummary => file !== null,
      );
      const allFolders: (FolderSummary | null)[] = await Promise.all(
        contents.map(async (fileName) => {
          const entryPath = path.join(folderPath, fileName);
          const entryStats = await fs.stat(entryPath);

          if (entryStats.isDirectory()) {
            try {
              const summaryFilePath = path.resolve(entryPath, 'summary.json');
              const file = await fs.readFile(summaryFilePath, 'utf8');
              return JSON.parse(file);
            } catch (e) {
              console.log(`Skipped: ${folderPath}`);
              return '';
            }
          }

          return null;
        }),
      );

      const folders = allFolders.filter(
        (folder): folder is FolderSummary => folder !== null,
      );

      // const summary = await callLLM(
      //   folderSummaryPrompt(folderPath, projectName, files, folders),
      //   models[LLMModels.GPT4].llm,
      // );

      const folderSummary: FolderSummary = {
        folderName,
        folderPath,
        githubUrl,
        files,
        folders: folders.filter(Boolean),
        summary: '',
        questions: '',
      };

      const outputPath = path.join(folderPath, 'summary.json');
      await fs.writeFile(
        outputPath,
        JSON.stringify(folderSummary, null, 2),
        'utf-8',
      );
      console.log(`Folder -> ${outputPath}`);
    } catch (e) {
      console.log(e);
      console.log(`Failed to get summary for folder: ${folderPath}`);
    }
  };

  const ignored = [
    '.*',
    '*/package-lock.json',
    '*/package.json',
    'node_modules',
    '*dist*',
    '*build*',
    '*test*',
    '*.svg',
    '*.md',
    '*.mdx',
    '*autodoc*',
  ];

  /**
   * Create markdown files for each code file in the project
   */

  await traverseFileSystem({
    inputPath: inputRoot,
    projectName,
    processFile,
    // processFolder,
    ignored,
  });

  /**
   * Create markdown summaries for each folder in the project
   */
  await traverseFileSystem({
    inputPath: outputRoot,
    projectName,
    processFolder,
    ignored,
  });

  /**
   * Print results
   */
  Object.values(models).forEach((model) => printModel(model));
  const totalCost = Object.values(models)
    .map(
      (model) =>
        (model.inputTokens * model.inputCostPer1KTokens) / 1000 +
        (model.outputTokens * model.outputCostPer1KTokens) / 1000,
    )
    .reduce((a, b) => a + b, 0);
  console.log(`Total Cost: $${totalCost}`);
  console.log(`Skipped: ${skipped}`);
};
