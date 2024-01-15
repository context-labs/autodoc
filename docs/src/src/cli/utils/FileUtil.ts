export function getFileName(
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

export const githubFileUrl = (
  githubRoot: string,
  inputRoot: string,
  filePath: string,
  linkHosted: boolean,
): string => {
  if (linkHosted) {
    return `${githubRoot}/${filePath.substring(inputRoot.length - 1)}`;
  } else {
    return `${githubRoot}/blob/master/${filePath.substring(
      inputRoot.length - 1,
    )}`;
  }
};

export const githubFolderUrl = (
  githubRoot: string,
  inputRoot: string,
  folderPath: string,
  linkHosted: boolean,
): string => {
  if (linkHosted) {
    return `${githubRoot}/${folderPath.substring(inputRoot.length - 1)}`;
  } else {
    return `${githubRoot}/tree/master/${folderPath.substring(
      inputRoot.length - 1,
    )}`;
  }
};
