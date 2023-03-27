import path from 'path';
import { AutodocRepoConfig } from '../../../types.js';
import { spinnerSuccess, updateSpinnerText } from '../../spinner.js';
import { processRepository } from '../index/processRepository.js';
import {
  printModelDetails,
  totalIndexCostEstimate,
} from '../../utils/LLMUtil.js';
import chalk from 'chalk';

export const estimate = async ({
  name,
  repositoryUrl,
  root,
  output,
  llms,
  ignore,
  filePrompt,
  folderPrompt,
  chatPrompt,
  contentType,
  targetAudience,
  linkHosted,
}: AutodocRepoConfig) => {
  const json = path.join(output, 'docs', 'json/');

  /**
   * Dry run of the processRepository command
   * to get the estimated price for indexing the repo
   */
  updateSpinnerText('Estimating cost...');

  const runDetails = await processRepository(
    {
      name,
      repositoryUrl,
      root,
      output: json,
      llms,
      ignore,
      filePrompt,
      folderPrompt,
      chatPrompt,
      contentType,
      targetAudience,
      linkHosted,
    },
    true,
  );
  spinnerSuccess();

  /**
   * Print Results
   */
  printModelDetails(Object.values(runDetails));
  const total = totalIndexCostEstimate(Object.values(runDetails));
  console.log(
    chalk.redBright(
      `Cost estimate to process this repository: $${total.toFixed(
        2,
      )}\nThis is just an estimate. Actual cost may vary.\nIt recommended that you set a limit in your OpenAI account to prevent unexpected charges.`,
    ),
  );
};
