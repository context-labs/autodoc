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
exports.traverseFileSystem = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const minimatch_1 = __importDefault(require("minimatch"));
const istextorbinary_1 = require("istextorbinary");
const traverseFileSystem = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { inputPath, projectName, processFile, processFolder, ignored } = params;
        try {
            yield promises_1.default.access(inputPath);
        }
        catch (error) {
            console.error('The provided folder path does not exist.');
            return;
        }
        const shouldIgnore = (fileName) => {
            return ignored.some((pattern) => (0, minimatch_1.default)(fileName, pattern));
        };
        const dfs = (currentPath) => __awaiter(void 0, void 0, void 0, function* () {
            const contents = (yield promises_1.default.readdir(currentPath)).filter((fileName) => !shouldIgnore(fileName));
            // // Create the output directory if it doesn't exist
            // try {
            //   await fs.mkdir(outputCurrentPath, { recursive: true });
            // } catch (error) {
            //   console.error(
            //     `Error creating output directory ${outputCurrentPath}:`,
            //     error,
            //   );
            //   return;
            // }
            yield Promise.all(contents.map((folderName) => __awaiter(void 0, void 0, void 0, function* () {
                const folderPath = path_1.default.join(currentPath, folderName);
                const entryStats = yield promises_1.default.stat(folderPath);
                if (entryStats.isDirectory()) {
                    yield dfs(folderPath);
                    yield (processFolder === null || processFolder === void 0 ? void 0 : processFolder({
                        folderName,
                        folderPath,
                        projectName,
                        shouldIgnore,
                    }));
                }
            })));
            yield Promise.all(contents.map((fileName) => __awaiter(void 0, void 0, void 0, function* () {
                const filePath = path_1.default.join(currentPath, fileName);
                const entryStats = yield promises_1.default.stat(filePath);
                if (entryStats.isFile() && (0, istextorbinary_1.isText)(fileName)) {
                    yield (processFile === null || processFile === void 0 ? void 0 : processFile({
                        fileName,
                        filePath,
                        projectName,
                    }));
                }
            })));
        });
        yield dfs(inputPath);
    }
    catch (e) {
        console.error(`Error during traversal: ${e.message}`);
        throw e;
    }
});
exports.traverseFileSystem = traverseFileSystem;
//# sourceMappingURL=traverseFileSystem.js.map