"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.run = void 0;
const vectorstores_1 = require("langchain/vectorstores");
const embeddings_1 = require("langchain/embeddings");
const text_splitter_1 = require("langchain/text_splitter");
const fs = __importStar(require("fs"));
const document_1 = require("langchain/document");
const document_loaders_1 = require("langchain/document_loaders");
const path_1 = __importDefault(require("path"));
function processFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, fileContents) => {
                if (err) {
                    reject(err);
                }
                else {
                    const metadata = { source: filePath };
                    const doc = new document_1.Document({
                        pageContent: fileContents,
                        metadata: metadata,
                    });
                    resolve(doc);
                }
            });
        });
    });
}
function processDirectory(directoryPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const docs = [];
        let files;
        try {
            files = fs.readdirSync(directoryPath);
        }
        catch (err) {
            console.error(err);
            throw new Error(`Could not read directory: ${directoryPath}. Did you run \`sh download.sh\`?`);
        }
        for (const file of files) {
            const filePath = path_1.default.join(directoryPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                const newDocs = processDirectory(filePath);
                const nestedDocs = yield newDocs;
                docs.push(...nestedDocs);
            }
            else {
                const newDoc = processFile(filePath);
                const doc = yield newDoc;
                docs.push(doc);
            }
        }
        return docs;
    });
}
class RepoLoader extends document_loaders_1.BaseDocumentLoader {
    constructor(filePath) {
        super();
        this.filePath = filePath;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield processDirectory(this.filePath);
        });
    }
}
/**
 * the Langchain loader for HNSWlib is passing invalid
 * values by default, so we make our own here.
 *
 * TODO: Figure this out and fix langchain
 */
function fromDocuments(docs, embeddings, dbConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const args = {
            docstore: dbConfig === null || dbConfig === void 0 ? void 0 : dbConfig.docstore,
            space: 'ip', // this is the field that isn't being set correctly
        };
        const instance = new vectorstores_1.HNSWLib(embeddings, args);
        yield instance.addDocuments(docs);
        return instance;
    });
}
const directoryPath = 'markdown/solana';
const loader = new RepoLoader(directoryPath);
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const rawDocs = yield loader.load();
    /* Split the text into chunks */
    const textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
        chunkSize: 8000,
        chunkOverlap: 100,
    });
    /* Split the docs */
    const docs = yield textSplitter.splitDocuments(rawDocs);
    /* Create the vectorstore */
    const vectorStore = yield fromDocuments(docs, new embeddings_1.OpenAIEmbeddings());
    yield vectorStore.save('data');
});
exports.run = run;
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.run)();
    console.log('done');
}))();
//# sourceMappingURL=createVectorStore.js.map