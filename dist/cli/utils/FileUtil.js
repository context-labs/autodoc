export function getFileName(input, delimiter = '.', extension = '.md') {
    const lastDelimiterIndex = input.lastIndexOf(delimiter);
    if (lastDelimiterIndex === -1) {
        // delimiter not found in string
        return input + extension;
    }
    else {
        return input.slice(0, lastDelimiterIndex) + extension;
    }
}
export const githubFileUrl = (githubRoot, inputRoot, filePath) => {
    return `${githubRoot}/blob/master/${filePath.substring(inputRoot.length - 1)}`;
};
export const githubFolderUrl = (githubRoot, inputRoot, folderPath) => {
    return `${githubRoot}/tree/master/${folderPath.substring(inputRoot.length - 1)}`;
};
//# sourceMappingURL=FileUtil.js.map