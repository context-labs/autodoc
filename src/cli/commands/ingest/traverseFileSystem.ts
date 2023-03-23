import fs from 'fs/promises';
import path from 'path';
import minimatch from 'minimatch';
import { isText } from 'istextorbinary';
import { CreateMarkdownParams } from './types';

export const traverseFileSystem = async (
  params: CreateMarkdownParams,
): Promise<void> => {
  try {
    const {
      inputPath,
      outputPath,
      projectName,
      processFile,
      processFolder,
      ignored,
    } = params;

    try {
      await fs.access(inputPath);
    } catch (error) {
      console.error('The provided folder path does not exist.');
      return;
    }

    const shouldIgnore = (fileName: string): boolean => {
      return ignored.some((pattern) => minimatch(fileName, pattern));
    };

    function getFileName(
      input: string,
      delimiter = '.',
      extension = '.md',
    ): string {
      const lastDelimiterIndex = input.lastIndexOf(delimiter);
      if (lastDelimiterIndex === -1) {
        // delimiter not found in string
        return input + extension;
      } else {
        return input.slice(0, lastDelimiterIndex) + extension;
      }
    }

    const dfs = async (
      currentPath: string,
      outputCurrentPath: string,
    ): Promise<void> => {
      const contents = (await fs.readdir(currentPath)).filter(
        (fileName) => !shouldIgnore(fileName),
      );

      // Create the output directory if it doesn't exist
      try {
        await fs.mkdir(outputCurrentPath, { recursive: true });
      } catch (error) {
        console.error(
          `Error creating output directory ${outputCurrentPath}:`,
          error,
        );
        return;
      }

      await Promise.all(
        contents.map(async (folderName) => {
          const inputFolderName = path.join(currentPath, folderName);
          const entryStats = await fs.stat(inputFolderName);

          if (entryStats.isDirectory()) {
            const outputFolderPath = path.join(outputCurrentPath, folderName);
            await dfs(inputFolderName, outputFolderPath);
            const folderSummary = await processFolder({
              folderName,
              folderPath: outputFolderPath,
              projectName,
              shouldIgnore,
            });
            console.log(`Foler -> ${outputFolderPath}`);
            const outputPath = path.join(outputFolderPath, 'summary.json');
            await fs.writeFile(
              outputPath,
              JSON.stringify(folderSummary, null, 2),
              'utf-8',
            );
          }
        }),
      );

      await Promise.all(
        contents.map(async (fileName) => {
          const filePath = path.join(currentPath, fileName);
          const entryStats = await fs.stat(filePath);

          if (entryStats.isFile() && isText(fileName)) {
            try {
              const processedContent = await processFile({
                fileName,
                filePath,
                projectName,
              });
              const autodocFileName = getFileName(fileName, '.', '.json');
              const outputPath = path.join(outputCurrentPath, autodocFileName);
              const content =
                processedContent.summary.length > 0
                  ? JSON.stringify(processedContent, null, 2)
                  : '';
              await fs.writeFile(outputPath, content, 'utf-8');
              console.log(`File -> ${outputPath}`);
            } catch (error) {
              console.error(`Error processing file ${filePath}:`, error);
            }
          }
        }),
      );
    };

    await dfs(inputPath, outputPath);
  } catch (e) {
    console.error('FAILED HERE');
    console.error(e);
  }
};
