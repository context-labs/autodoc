import fs from 'node:fs/promises';
import path from 'node:path';
import { encoding_for_model } from '@dqbd/tiktoken';
import { APIRateLimit } from '../../utils/APIRateLimit.js';
import { createCodeFileSummary, createCodeQuestions, folderSummaryPrompt, } from './prompts.js';
import { LLMModels, } from '../../../types.js';
import { traverseFileSystem } from '../../utils/traverseFileSystem.js';
import { spinnerSuccess, stopSpinner, updateSpinnerText } from '../../spinner.js';
import { getFileName, githubFileUrl, githubFolderUrl, } from '../../utils/FileUtil.js';
import { models, printModelDetails } from '../../utils/LLMUtil.js';
export const processRepository = async ({ name: projectName, repositoryUrl, root: inputRoot, output: outputRoot, llms, ignore, }) => {
    const encoding = encoding_for_model('gpt-3.5-turbo');
    const rateLimit = new APIRateLimit(25);
    const callLLM = async (prompt, model) => {
        return rateLimit.callApi(() => model.call(prompt));
    };
    const isModel = (model) => model !== null;
    const processFile = async ({ fileName, filePath, projectName, }) => {
        const content = await fs.readFile(filePath, 'utf-8');
        const markdownFilePath = path.join(outputRoot, filePath);
        /**
         * Create the output directory if it doesn't exist
         */
        try {
            await fs.mkdir(markdownFilePath.replace(fileName, ''), {
                recursive: true,
            });
        }
        catch (error) {
            console.error(error);
            return;
        }
        const url = githubFileUrl(repositoryUrl, inputRoot, filePath);
        const summaryPrompt = createCodeFileSummary(projectName, projectName, content);
        const questionsPrompt = createCodeQuestions(projectName, projectName, content);
        const summaryLength = encoding.encode(summaryPrompt).length;
        const questionLength = encoding.encode(questionsPrompt).length;
        const max = Math.max(questionLength, summaryLength);
        const model = (() => {
            if (models[LLMModels.GPT4].maxLength > max) {
                return models[LLMModels.GPT4];
            }
            else if (models[LLMModels.GPT432k].maxLength > max) {
                return models[LLMModels.GPT432k];
            }
            else {
                return null;
            }
        })();
        if (!isModel(model)) {
            console.log(`Skipped ${filePath} | Length ${max}`);
            return;
        }
        try {
            /** Call LLM */
            const [summary, questions] = await Promise.all([
                callLLM(summaryPrompt, model.llm),
                callLLM(questionsPrompt, model.llm),
            ]);
            /**
             * Create file and save to disk
             */
            const file = {
                fileName,
                filePath,
                url,
                summary,
                questions,
            };
            const outputPath = getFileName(markdownFilePath, '.', '.json');
            const content = file.summary.length > 0 ? JSON.stringify(file, null, 2) : '';
            await fs.writeFile(outputPath, content, 'utf-8');
            console.log(`File: ${fileName} => ${outputPath}`);
            /**
             * Track usage for end of run summary
             */
            model.inputTokens += summaryLength + questionLength;
            model.total++;
            model.outputTokens += 1000;
            model.succeeded++;
        }
        catch (e) {
            console.log(e);
            console.error(`Failed to get summary for file ${fileName}`);
            model.failed++;
        }
    };
    const processFolder = async ({ folderName, folderPath, projectName, shouldIgnore, }) => {
        const contents = (await fs.readdir(folderPath)).filter((fileName) => !shouldIgnore(fileName));
        const url = githubFolderUrl(repositoryUrl, inputRoot, folderPath);
        const allFiles = await Promise.all(contents.map(async (fileName) => {
            const entryPath = path.join(folderPath, fileName);
            const entryStats = await fs.stat(entryPath);
            if (entryStats.isFile() && fileName !== 'summary.json') {
                const file = await fs.readFile(entryPath, 'utf8');
                return file.length > 0 ? JSON.parse(file) : null;
            }
            return null;
        }));
        try {
            const files = allFiles.filter((file) => file !== null);
            const allFolders = await Promise.all(contents.map(async (fileName) => {
                const entryPath = path.join(folderPath, fileName);
                const entryStats = await fs.stat(entryPath);
                if (entryStats.isDirectory()) {
                    try {
                        const summaryFilePath = path.resolve(entryPath, 'summary.json');
                        const file = await fs.readFile(summaryFilePath, 'utf8');
                        return JSON.parse(file);
                    }
                    catch (e) {
                        console.log(`Skipped: ${folderPath}`);
                        return null;
                    }
                }
                return null;
            }));
            const folders = allFolders.filter((folder) => folder !== null);
            const summary = await callLLM(folderSummaryPrompt(folderPath, projectName, files, folders), models[LLMModels.GPT4].llm);
            const folderSummary = {
                folderName,
                folderPath,
                url,
                files,
                folders: folders.filter(Boolean),
                summary,
                questions: '',
            };
            const outputPath = path.join(folderPath, 'summary.json');
            await fs.writeFile(outputPath, JSON.stringify(folderSummary, null, 2), 'utf-8');
            console.log(`Folder: ${folderName} => ${outputPath}`);
        }
        catch (e) {
            console.log(e);
            console.log(`Failed to get summary for folder: ${folderPath}`);
        }
    };
    /**
     * Get the numver of files and folderfs in the project
     */
    const filesAndFolders = async () => {
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
    /**
     * Create markdown files for each code file in the project
     */
    updateSpinnerText(`Processing ${files} files...`);
    await traverseFileSystem({
        inputPath: inputRoot,
        projectName,
        processFile,
        ignore,
    });
    spinnerSuccess(`Processing ${files} files...`);
    /**
     * Create markdown summaries for each folder in the project
     */
    updateSpinnerText(`Processing ${folders} folders... `);
    await traverseFileSystem({
        inputPath: outputRoot,
        projectName,
        processFolder,
        ignore,
    });
    spinnerSuccess(`Processing ${folders} folders... `);
    stopSpinner();
    /**
     * Print results
     */
    printModelDetails(Object.values(models));
};
//# sourceMappingURL=processRepository.js.map