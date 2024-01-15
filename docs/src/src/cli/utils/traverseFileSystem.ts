import fs from 'node:fs/promises';
import path from 'path';
import minimatch from 'minimatch';
import { isText } from 'istextorbinary';
import { TraverseFileSystemParams } from '../../types.js';

export const traverseFileSystem = async (
  params: TraverseFileSystemParams,
): Promise<void> => {
  try {
    const {
      inputPath,
      projectName,
      processFile,
      processFolder,
      ignore,
      filePrompt,
      folderPrompt,
      contentType,
      targetAudience,
      linkHosted,
    } = params;

    try {
      await fs.access(inputPath);
    } catch (error) {
      console.error('The provided folder path does not exist.');
      return;
    }

    const shouldIgnore = (fileName: string): boolean => {
      return ignore.some((pattern) => minimatch(fileName, pattern));
    };

    const dfs = async (currentPath: string): Promise<void> => {
      const contents = (await fs.readdir(currentPath)).filter(
        (fileName) => !shouldIgnore(fileName),
      );

      await Promise.all(
        contents.map(async (folderName) => {
          const folderPath = path.join(currentPath, folderName);
          const entryStats = await fs.stat(folderPath);

          if (entryStats.isDirectory()) {
            await dfs(folderPath);

            await processFolder?.({
              inputPath,
              folderName,
              folderPath,
              projectName,
              shouldIgnore,
              folderPrompt,
              contentType,
              targetAudience,
              linkHosted,
            });
          }
        }),
      );

      await Promise.all(
        contents.map(async (fileName) => {
          const filePath = path.join(currentPath, fileName);
          const entryStats = await fs.stat(filePath);

          if (!entryStats.isFile()) {
            return;
          }

          const buffer = await fs.readFile(filePath);

          if (isText(fileName, buffer)) {
            await processFile?.({
              fileName,
              filePath,
              projectName,
              filePrompt,
              contentType,
              targetAudience,
              linkHosted,
            });
          }
        }),
      );
    };

    await dfs(inputPath);
  } catch (e: any) {
    console.error(`Error during traversal: ${e.message}`);
    throw e;
  }
};
