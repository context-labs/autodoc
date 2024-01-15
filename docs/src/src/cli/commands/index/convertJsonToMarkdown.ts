import fs from 'node:fs/promises';
import path from 'path';
import {
  AutodocRepoConfig,
  FileSummary,
  FolderSummary,
  ProcessFile,
} from '../../../types';
import { traverseFileSystem } from '../../utils/traverseFileSystem.js';
import { spinnerSuccess, updateSpinnerText } from '../../spinner.js';
import { getFileName } from '../../utils/FileUtil.js';

export const convertJsonToMarkdown = async ({
  name: projectName,
  root: inputRoot,
  output: outputRoot,
  filePrompt: filePrompt,
  folderPrompt: folderPrompt,
  contentType: contentType,
  targetAudience: targetAudience,
  linkHosted: linkHosted,
}: AutodocRepoConfig) => {
  /**
   * Count the number of files in the project
   */
  let files = 0;
  await traverseFileSystem({
    inputPath: inputRoot,
    projectName,
    processFile: () => {
      files++;
      return Promise.resolve();
    },
    ignore: [],
    filePrompt,
    folderPrompt,
    contentType,
    targetAudience,
    linkHosted,
  });

  /**
   * Create markdown files for each code file in the project
   */

  const processFile: ProcessFile = async ({
    fileName,
    filePath,
  }): Promise<void> => {
    const content = await fs.readFile(filePath, 'utf-8');

    // TODO: Handle error
    if (!content) return;

    const markdownFilePath = path
      .join(outputRoot, filePath)
      .replace(inputRoot, '');

    /**
     * Create the output directory if it doesn't exist
     */
    try {
      await fs.mkdir(markdownFilePath.replace(fileName, ''), {
        recursive: true,
      });
    } catch (error) {
      console.error(error);
      return;
    }

    const { url, summary, questions } =
      fileName === 'summary.json'
        ? (JSON.parse(content) as FolderSummary)
        : (JSON.parse(content) as FileSummary);

    /**
     * Only include the file if it has a summary
     */
    const markdown =
      summary.length > 0
        ? `[View code on GitHub](${url})\n\n${summary}\n${
            questions ? '## Questions: \n ' + questions : ''
          }`
        : '';

    const outputPath = getFileName(markdownFilePath, '.', '.md');
    await fs.writeFile(outputPath, markdown, 'utf-8');
  };

  updateSpinnerText(`Creating ${files} markdown files...`);
  await traverseFileSystem({
    inputPath: inputRoot,
    projectName,
    processFile,
    ignore: [],
    filePrompt,
    folderPrompt,
    contentType,
    targetAudience,
    linkHosted,
  });
  spinnerSuccess(`Created ${files} markdown files...`);
};
