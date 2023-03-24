import { AutodocRepoConfig, LLMModelDetails, LLMModels } from '../../../types.js';
export declare const processRepository: ({ name: projectName, repositoryUrl, root: inputRoot, output: outputRoot, llms, ignore, }: AutodocRepoConfig, dryRun?: boolean) => Promise<Record<LLMModels, LLMModelDetails>>;
