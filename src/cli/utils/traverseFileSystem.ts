import fs from 'fs/promises';
import path from 'path';
import minimatch from 'minimatch';
import { isText } from 'istextorbinary';
import { CreateMarkdownParams } from '../../types';

export const traverseFileSystem = async (
  params: CreateMarkdownParams,
): Promise<void> => {
  try {
    const { inputPath, projectName, processFile, processFolder, ignored } =
      params;

    try {
      await fs.access(inputPath);
    } catch (error) {
      console.error('The provided folder path does not exist.');
      return;
    }

    const shouldIgnore = (fileName: string): boolean => {
      return ignored.some((pattern) => minimatch(fileName, pattern));
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
              folderName,
              folderPath,
              projectName,
              shouldIgnore,
            });
          }
        }),
      );

      await Promise.all(
        contents.map(async (fileName) => {
          const filePath = path.join(currentPath, fileName);
          const entryStats = await fs.stat(filePath);

          if (entryStats.isFile() && isText(fileName)) {
            await processFile?.({
              fileName,
              filePath,
              projectName,
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
