import type { HierarchicalNSW as HierarchicalNSWT, SpaceName } from 'hnswlib-node';
import { Document, InMemoryDocstore } from 'langchain/docstore';
import { Embeddings } from 'langchain/embeddings';
import { SaveableVectorStore } from 'langchain/vectorstores';
export interface HNSWLibBase {
    space: SpaceName;
    numDimensions?: number;
}
export interface HNSWLibArgs extends HNSWLibBase {
    docstore?: InMemoryDocstore;
    index?: HierarchicalNSWT;
}
export declare class HNSWLib extends SaveableVectorStore {
    _index?: HierarchicalNSWT;
    docstore: InMemoryDocstore;
    args: HNSWLibBase;
    constructor(embeddings: Embeddings, args: HNSWLibArgs);
    addDocuments(documents: Document[]): Promise<void>;
    private static getHierarchicalNSW;
    private initIndex;
    get index(): HierarchicalNSWT;
    private set index(value);
    addVectors(vectors: number[][], documents: Document[]): Promise<void>;
    similaritySearchVectorWithScore(query: number[], k: number): Promise<[Document, number][]>;
    save(directory: string): Promise<void>;
    static load(directory: string, embeddings: Embeddings): Promise<HNSWLib>;
    static fromTexts(texts: string[], metadatas: object[], embeddings: Embeddings, dbConfig?: {
        docstore?: InMemoryDocstore;
    }): Promise<HNSWLib>;
    static fromDocuments(docs: Document[], embeddings: Embeddings, dbConfig?: {
        docstore?: InMemoryDocstore;
    }): Promise<HNSWLib>;
    static imports(): Promise<{
        HierarchicalNSW: typeof HierarchicalNSWT;
    }>;
}
