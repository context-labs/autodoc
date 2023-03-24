import path from 'path';
import { spinnerSuccess, updateSpinnerText } from '../../spinner.js';
import { processRepository } from '../index/processRepository.js';
export const estimate = async ({ name, repositoryUrl, root, output, llms, ignore, }) => {
    const json = path.join(output, 'docs', 'json/');
    /**
     * Dry run of the processRepository command
     * to get the estimated price for indexing the repo
     */
    updateSpinnerText('Processing repository...');
    await processRepository({
        name,
        repositoryUrl,
        root,
        output: json,
        llms,
        ignore,
    }, true);
    spinnerSuccess();
};
//# sourceMappingURL=index.js.map