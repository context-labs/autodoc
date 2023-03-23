import path from 'path';
import { AutodocConfig } from '../../../types';
import { spinnerSuccess, updateSpinnerText } from '../../spinner';
import { convertJsonToMarkdown } from './convertJsonToMarkdown';
import { processRepository } from './processRepository';

export const index = async ({
  name,
  url,
  root,
  output,
  llms,
  ignore,
}: AutodocConfig) => {
  const json = path.join(output, 'docs', 'json/');
  const markdown = path.join(output, 'docs', 'markdown/');

  /**
   * Traverse the repository, call LLMS for each file,
   * and create JSON files with the results.
   */

  updateSpinnerText('Processing repository...');
  await processRepository({
    name,
    url,
    root,
    output: json,
    llms,
    ignore,
  });
  spinnerSuccess();

  /**
   * Create markdown files from JSON files
   */
  updateSpinnerText('Creating markdown files...');
  await convertJsonToMarkdown({
    name,
    url,
    root: json,
    output: markdown,
    llms,
    ignore,
  });
  spinnerSuccess();
};

export default {
  index,
};
