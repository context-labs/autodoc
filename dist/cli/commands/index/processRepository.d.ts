import { AutodocConfig } from '../../../types.js';
export declare const processRepository: ({ name: projectName, repositoryUrl, root: inputRoot, output: outputRoot, llms, ignore, }: AutodocConfig, dryRun?: boolean) => Promise<void>;
