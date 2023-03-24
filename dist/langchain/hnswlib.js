import fs from 'node:fs/promises';
import path from 'node:path';
import HierarchicalNSW from 'hnswlib-node';
import { Document, InMemoryDocstore } from 'langchain/docstore';
import { SaveableVectorStore } from 'langchain/vectorstores';
export class HNSWLib extends SaveableVectorStore {
    constructor(embeddings, args) {
        super(embeddings, args);
        this._index = args.index;
        this.args = args;
        this.embeddings = embeddings;
        this.docstore = args?.docstore ?? new InMemoryDocstore();
    }
    async addDocuments(documents) {
        const texts = documents.map(({ pageContent }) => pageContent);
        return this.addVectors(await this.embeddings.embedDocuments(texts), documents);
    }
    static async getHierarchicalNSW(args) {
        const { HierarchicalNSW } = await HNSWLib.imports();
        if (!args.space) {
            throw new Error('hnswlib-node requires a space argument');
        }
        if (args.numDimensions === undefined) {
            throw new Error('hnswlib-node requires a numDimensions argument');
        }
        return new HierarchicalNSW(args.space, args.numDimensions);
    }
    async initIndex(vectors) {
        if (!this._index) {
            if (this.args.numDimensions === undefined) {
                this.args.numDimensions = vectors[0].length;
            }
            this.index = await HNSWLib.getHierarchicalNSW(this.args);
        }
        if (!this.index.getCurrentCount()) {
            this.index.initIndex(vectors.length);
        }
    }
    get index() {
        if (!this._index) {
            throw new Error('Vector store not initialised yet. Try calling `addTexts` first.');
        }
        return this._index;
    }
    set index(index) {
        this._index = index;
    }
    async addVectors(vectors, documents) {
        if (vectors.length === 0) {
            return;
        }
        await this.initIndex(vectors);
        // TODO here we could optionally normalise the vectors to unit length
        // so that dot product is equivalent to cosine similarity, like this
        // https://github.com/nmslib/hnswlib/issues/384#issuecomment-1155737730
        // While we only support OpenAI embeddings this isn't necessary
        if (vectors.length !== documents.length) {
            throw new Error(`Vectors and metadatas must have the same length`);
        }
        if (vectors[0].length !== this.args.numDimensions) {
            throw new Error(`Vectors must have the same length as the number of dimensions (${this.args.numDimensions})`);
        }
        const capacity = this.index.getMaxElements();
        const needed = this.index.getCurrentCount() + vectors.length;
        if (needed > capacity) {
            this.index.resizeIndex(needed);
        }
        const docstoreSize = this.docstore.count;
        for (let i = 0; i < vectors.length; i += 1) {
            this.index.addPoint(vectors[i], docstoreSize + i);
            this.docstore.add({ [docstoreSize + i]: documents[i] });
        }
    }
    async similaritySearchVectorWithScore(query, k) {
        if (query.length !== this.args.numDimensions) {
            throw new Error(`Query vector must have the same length as the number of dimensions (${this.args.numDimensions})`);
        }
        if (k > this.index.getCurrentCount()) {
            const total = this.index.getCurrentCount();
            console.warn(`k (${k}) is greater than the number of elements in the index (${total}), setting k to ${total}`);
            // eslint-disable-next-line no-param-reassign
            k = total;
        }
        const result = this.index.searchKnn(query, k);
        return result.neighbors.map((docIndex, resultIndex) => [
            this.docstore.search(String(docIndex)),
            result.distances[resultIndex],
        ]);
    }
    async save(directory) {
        await fs.mkdir(directory, { recursive: true });
        await Promise.all([
            this.index.writeIndex(path.join(directory, 'hnswlib.index')),
            await fs.writeFile(path.join(directory, 'args.json'), JSON.stringify(this.args)),
            await fs.writeFile(path.join(directory, 'docstore.json'), JSON.stringify(Array.from(this.docstore._docs.entries()))),
        ]);
    }
    static async load(directory, embeddings) {
        const args = JSON.parse(await fs.readFile(path.join(directory, 'args.json'), 'utf8'));
        const index = await HNSWLib.getHierarchicalNSW(args);
        const [docstoreFiles] = await Promise.all([
            fs
                .readFile(path.join(directory, 'docstore.json'), 'utf8')
                .then(JSON.parse),
            index.readIndex(path.join(directory, 'hnswlib.index')),
        ]);
        args.docstore = new InMemoryDocstore(new Map(docstoreFiles));
        args.index = index;
        return new HNSWLib(embeddings, args);
    }
    static async fromTexts(texts, metadatas, embeddings, dbConfig) {
        const docs = [];
        for (let i = 0; i < texts.length; i += 1) {
            const newDoc = new Document({
                pageContent: texts[i],
                metadata: metadatas[i],
            });
            docs.push(newDoc);
        }
        return HNSWLib.fromDocuments(docs, embeddings, dbConfig);
    }
    static async fromDocuments(docs, embeddings, dbConfig) {
        const args = {
            docstore: dbConfig?.docstore,
            space: 'cosine',
        };
        const instance = new this(embeddings, args);
        await instance.addDocuments(docs);
        return instance;
    }
    static async imports() {
        return HierarchicalNSW;
    }
}
//# sourceMappingURL=hnswlib.js.map