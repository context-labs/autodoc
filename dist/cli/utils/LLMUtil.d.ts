import { LLMModelDetails, LLMModels } from '../../types.js';
export declare const models: Record<LLMModels, LLMModelDetails>;
export declare const printModelDetails: (models: LLMModelDetails[]) => void;
export declare const totalIndexCostEstimate: (models: LLMModelDetails[]) => number;
