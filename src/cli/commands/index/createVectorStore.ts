import { HNSWLib } from 'langchain/vectorstores';
import { Embeddings, OpenAIEmbeddings } from 'langchain/embeddings';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as fs from 'fs';
import { Document } from 'langchain/document';
import { BaseDocumentLoader } from 'langchain/document_loaders';
import path from 'path';
import { InMemoryDocstore } from 'langchain/dist/docstore';
import { SpaceName } from 'hnswlib-node';

async function processFile(filePath: string): Promise<Document> {
  return await new Promise<Document>((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, fileContents) => {
      if (err) {
        reject(err);
      } else {
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

async function processDirectory(directoryPath: string): Promise<Document[]> {
  const docs: Document[] = [];
  let files: string[];
  try {
    files = fs.readdirSync(directoryPath);
  } catch (err) {
    console.error(err);
    throw new Error(
      `Could not read directory: ${directoryPath}. Did you run \`sh download.sh\`?`,
    );
  }
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const newDocs = processDirectory(filePath);
      const nestedDocs = await newDocs;
      docs.push(...nestedDocs);
    } else {
      const newDoc = processFile(filePath);
      const doc = await newDoc;
      docs.push(doc);
    }
  }
  return docs;
}

class RepoLoader extends BaseDocumentLoader {
  constructor(public filePath: string) {
    super();
  }
  async load(): Promise<Document[]> {
    return await processDirectory(this.filePath);
  }
}

/**
 * the Langchain loader for HNSWlib is passing invalid
 * values by default, so we make our own here.
 *
 * TODO: Figure this out and fix langchain
 */

async function fromDocuments(
  docs: Document[],
  embeddings: Embeddings,
  dbConfig?: {
    docstore?: InMemoryDocstore;
  },
): Promise<HNSWLib> {
  const args = {
    docstore: dbConfig?.docstore,
    space: 'ip' as SpaceName, // this is the field that isn't being set correctly
  };
  const instance = new HNSWLib(embeddings, args);
  await instance.addDocuments(docs);
  return instance;
}

const directoryPath = 'markdown/solana';
const loader = new RepoLoader(directoryPath);

export const run = async () => {
  const rawDocs = await loader.load();

  /* Split the text into chunks */
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 8000,
    chunkOverlap: 100,
  });

  /* Split the docs */
  const docs = await textSplitter.splitDocuments(rawDocs);

  /* Create the vectorstore */
  const vectorStore = await fromDocuments(docs, new OpenAIEmbeddings());
  await vectorStore.save('data');
};

(async () => {
  await run();
  console.log('done');
})();
