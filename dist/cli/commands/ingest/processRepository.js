"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRepository = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const llms_1 = require("langchain/llms");
const tiktoken_1 = require("@dqbd/tiktoken");
const APIRateLimit_1 = require("./APIRateLimit");
const prompts_1 = require("./prompts");
const types_1 = require("./types");
const traverseFileSystem_1 = require("./traverseFileSystem");
const models = {
    [types_1.LLMModels.GPT3]: {
        name: types_1.LLMModels.GPT3,
        inputCostPer1KTokens: 0.002,
        outputCostPer1KTokens: 0.002,
        maxLength: 3050,
        llm: new llms_1.OpenAIChat({
            temperature: 0.1,
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: types_1.LLMModels.GPT3,
        }),
        inputTokens: 0,
        outputTokens: 0,
        succeeded: 0,
        failed: 0,
        total: 0,
    },
    [types_1.LLMModels.GPT4]: {
        name: types_1.LLMModels.GPT4,
        inputCostPer1KTokens: 0.03,
        outputCostPer1KTokens: 0.06,
        maxLength: 8192,
        llm: new llms_1.OpenAIChat({
            temperature: 0.1,
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: types_1.LLMModels.GPT4,
        }),
        inputTokens: 0,
        outputTokens: 0,
        succeeded: 0,
        failed: 0,
        total: 0,
    },
    [types_1.LLMModels.GPT432k]: {
        name: types_1.LLMModels.GPT432k,
        inputCostPer1KTokens: 0.06,
        outputCostPer1KTokens: 0.12,
        maxLength: 32768,
        llm: new llms_1.OpenAIChat({
            temperature: 0.1,
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: types_1.LLMModels.GPT4,
        }),
        inputTokens: 0,
        outputTokens: 0,
        succeeded: 0,
        failed: 0,
        total: 0,
    },
};
const printModel = (model) => {
    console.log('\n');
    console.log(`Model: ${model.name}`);
    console.log('--------------------');
    console.log(`Succeeded: ${model.succeeded}`);
    console.log(`Failed: ${model.failed}`);
    console.log(`Total: ${model.total}`);
    console.log(`Input Tokens: ${model.inputTokens}`);
    console.log(`Input Tokens Cost: $${(model.inputTokens / 1000) * model.inputCostPer1KTokens}`);
    console.log(`Ouput Tokens: ${model.outputTokens}`);
    console.log(`Output Tokens Cost: $${(model.outputTokens / 1000) * model.outputCostPer1KTokens}`);
    console.log('--------------------');
    console.log('\n');
};
function getFileName(input, delimiter = '.', extension = '.md') {
    const lastDelimiterIndex = input.lastIndexOf(delimiter);
    if (lastDelimiterIndex === -1) {
        // delimiter not found in string
        return input + extension;
    }
    else {
        return input.slice(0, lastDelimiterIndex) + extension;
    }
}
const processRepository = (projectName, githubRoot, inputRoot, outputRoot) => __awaiter(void 0, void 0, void 0, function* () {
    const encoding = (0, tiktoken_1.encoding_for_model)('gpt-3.5-turbo');
    const skipped = 0;
    const rateLimit = new APIRateLimit_1.APIRateLimit();
    const callLLM = (prompt, model) => __awaiter(void 0, void 0, void 0, function* () {
        return rateLimit.callApi(() => model.call(prompt));
    });
    const rootPath = `./repo/${projectName}`;
    const githubFileUrl = (filePath) => {
        return `${githubRoot}/blob/master/${filePath.substring(rootPath.length - 1)}`;
    };
    const githubFolderUrl = (folderPath) => {
        return `${githubRoot}/tree/master/${folderPath.substring(rootPath.length - 1)}`;
    };
    const processFile = ({ fileName, filePath, projectName, }) => __awaiter(void 0, void 0, void 0, function* () {
        const content = yield promises_1.default.readFile(filePath, 'utf-8');
        const markdownFilePath = filePath.replace(inputRoot, outputRoot);
        const githubUrl = githubFileUrl(filePath);
        const summaryPrompt = (0, prompts_1.createCodeFileSummary)(filePath.substring(5), projectName, content);
        const questionsPrompt = (0, prompts_1.createCodeQuestions)(filePath.substring(5), projectName, content);
        const summaryLength = encoding.encode(summaryPrompt).length;
        const questionLength = encoding.encode(questionsPrompt).length;
        const max = Math.max(questionLength, summaryLength);
        const model = (() => {
            if (models[types_1.LLMModels.GPT4].maxLength > max) {
                return models[types_1.LLMModels.GPT4];
            }
            else if (models[types_1.LLMModels.GPT432k].maxLength > max) {
                return models[types_1.LLMModels.GPT432k];
            }
            else {
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
            const [summary, questions] = yield Promise.all([
                callLLM(summaryPrompt, model.llm),
                callLLM(questionsPrompt, model.llm),
            ]);
            // model.outputTokens +=
            //   encoding.encode(summary).length + encoding.encode(questions).length;
            // model.succeeded++;
            const file = {
                fileName,
                filePath,
                githubUrl,
                summary,
                questions,
            };
            const autodocFileName = getFileName(fileName, '.', '.json');
            const outputPath = path_1.default.join(markdownFilePath, autodocFileName);
            const content = file.summary.length > 0 ? JSON.stringify(file, null, 2) : '';
            yield promises_1.default.writeFile(outputPath, JSON.stringify(content), 'utf-8');
        }
        catch (e) {
            console.log(e);
            console.error(`Failed to get summary for file ${fileName}`);
            // model.failed++;
        }
    });
    const processFolder = ({ folderName, folderPath, projectName, shouldIgnore, }) => __awaiter(void 0, void 0, void 0, function* () {
        const contents = (yield promises_1.default.readdir(folderPath)).filter((fileName) => !shouldIgnore(fileName));
        const githubUrl = githubFolderUrl(folderPath);
        const allFiles = yield Promise.all(contents.map((fileName) => __awaiter(void 0, void 0, void 0, function* () {
            const entryPath = path_1.default.join(folderPath, fileName);
            const entryStats = yield promises_1.default.stat(entryPath);
            if (entryStats.isFile() && fileName !== 'summary.json') {
                const file = yield promises_1.default.readFile(entryPath, 'utf8');
                return file.length > 0 ? JSON.parse(file) : null;
            }
            return null;
        })));
        try {
            const files = allFiles.filter((file) => file !== null);
            const allFolders = yield Promise.all(contents.map((fileName) => __awaiter(void 0, void 0, void 0, function* () {
                const entryPath = path_1.default.join(folderPath, fileName);
                const entryStats = yield promises_1.default.stat(entryPath);
                if (entryStats.isDirectory()) {
                    try {
                        const summaryFilePath = path_1.default.resolve(entryPath, 'summary.json');
                        const file = yield promises_1.default.readFile(summaryFilePath, 'utf8');
                        return JSON.parse(file);
                    }
                    catch (e) {
                        console.log(`Skipped: ${folderPath}`);
                        return '';
                    }
                }
                return null;
            })));
            const folders = allFolders.filter((folder) => folder !== null);
            const summary = yield callLLM((0, prompts_1.folderSummaryPrompt)(folderPath, projectName, files, folders), models[types_1.LLMModels.GPT4].llm);
            const folderSummary = {
                folderName,
                folderPath,
                githubUrl,
                files,
                folders: folders.filter(Boolean),
                summary,
                questions: '',
            };
            const outputPath = path_1.default.join(folderPath, 'summary.json');
            yield promises_1.default.writeFile(outputPath, JSON.stringify(folderSummary, null, 2), 'utf-8');
            console.log(`Folder -> ${outputPath}`);
        }
        catch (e) {
            console.log(e);
            console.log(`Failed to get summary for folder: ${folderPath}`);
        }
    });
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
    ];
    /**
     * Create markdown files for each code file in the project
     */
    yield (0, traverseFileSystem_1.traverseFileSystem)({
        inputPath: rootPath,
        projectName,
        processFile,
        // processFolder,
        ignored,
    });
    /**
     * Create markdown summaries for each folder in the project
     */
    yield (0, traverseFileSystem_1.traverseFileSystem)({
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
        .map((model) => (model.inputTokens * model.inputCostPer1KTokens) / 1000 +
        (model.outputTokens * model.outputCostPer1KTokens) / 1000)
        .reduce((a, b) => a + b, 0);
    console.log(`Total Cost: $${totalCost}`);
    console.log(`Skipped: ${skipped}`);
});
exports.processRepository = processRepository;
//# sourceMappingURL=processRepository.js.map