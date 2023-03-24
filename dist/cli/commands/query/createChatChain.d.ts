import { ChatVectorDBQAChain } from 'langchain/chains';
import { HNSWLib } from '../../../langchain/hnswlib.js';
export declare const makeChain: (projectName: string, repositoryUrl: string, vectorstore: HNSWLib, onTokenStream?: ((token: string) => void) | undefined) => ChatVectorDBQAChain;
