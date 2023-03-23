import path from 'path';
import { AutodocConfig } from '../../../types';
import { spinnerSuccess, updateSpinnerText } from '../../spinner';
import { convertJsonToMarkdown } from './convertJsonToMarkdown';
import { createVectorStore } from './createVectorStore';
import { processRepository } from './processRepository';

export const index = async ({
  name,
  repositoryUrl,
  root,
  output,
  llms,
  ignore,
}: AutodocConfig) => {
  const json = path.join(output, 'docs', 'json/');
  const markdown = path.join(output, 'docs', 'markdown/');
  const data = path.join(output, 'docs', 'data/');

  /**
   * Traverse the repository, call LLMS for each file,
   * and create JSON files with the results.
   */

  // updateSpinnerText('Processing repository...');
  // await processRepository({
  //   name,
  //   repositoryUrl,
  //   root,
  //   output: json,
  //   llms,
  //   ignore,
  // });
  // spinnerSuccess();

  /**
   * Create markdown files from JSON files
   */
  updateSpinnerText('Creating markdown files...');
  await convertJsonToMarkdown({
    name,
    repositoryUrl,
    root: json,
    output: markdown,
    llms,
    ignore,
  });
  spinnerSuccess();

  updateSpinnerText('Create vector files...');
  await createVectorStore({
    name,
    repositoryUrl,
    root: markdown,
    output: data,
    llms,
    ignore,
  });
};

export default {
  index,
};
