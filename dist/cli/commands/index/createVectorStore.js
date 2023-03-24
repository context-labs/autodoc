import { OpenAIEmbeddings } from 'langchain/embeddings';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as fs from 'fs';
import { Document } from 'langchain/document';
import { BaseDocumentLoader } from 'langchain/document_loaders';
import path from 'path';
import { HNSWLib } from '../../../langchain/hnswlib.js';
async function processFile(filePath) {
    return await new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, fileContents) => {
            if (err) {
                reject(err);
            }
            else {
                const metadata = { source: filePath };
                const doc = new Document({
                    pageContent: fileContents,
                    metadata: metadata,
                });
                resolve(doc);
            }
        });
    });
}
async function processDirectory(directoryPath) {
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
        const filePath = path.join(directoryPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            const newDocs = processDirectory(filePath);
            const nestedDocs = await newDocs;
            docs.push(...nestedDocs);
        }
        else {
            const newDoc = processFile(filePath);
            const doc = await newDoc;
            docs.push(doc);
        }
    }
    return docs;
}
class RepoLoader extends BaseDocumentLoader {
    constructor(filePath) {
        super();
        this.filePath = filePath;
    }
    async load() {
        return await processDirectory(this.filePath);
    }
}
export const createVectorStore = async ({ root, output, }) => {
    const loader = new RepoLoader(root);
    const rawDocs = await loader.load();
    /* Split the text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 8000,
        chunkOverlap: 100,
    });
    const docs = await textSplitter.splitDocuments(rawDocs);
    /* Create the vectorstore */
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    await vectorStore.save(output);
};
//# sourceMappingURL=createVectorStore.js.map