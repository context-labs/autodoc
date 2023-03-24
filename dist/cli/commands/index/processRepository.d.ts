import { AutodocConfig, LLMModelDetails, LLMModels } from '../../../types.js';
export declare const processRepository: ({ name: projectName, repositoryUrl, root: inputRoot, output: outputRoot, llms, ignore, }: AutodocConfig, dryRun?: boolean) => Promise<Record<LLMModels, LLMModelDetails>>;
