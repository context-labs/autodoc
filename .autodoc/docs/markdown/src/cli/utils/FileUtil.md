[View code on GitHub](https://github.com/context-labs/autodoc/src\cli\utils\FileUtil.ts)

This code provides utility functions for handling file and folder paths in the autodoc project. The main purpose of these functions is to generate file names and GitHub URLs for documentation files.

1. `getFileName(input, delimiter, extension)`: This function takes an input string, an optional delimiter (default is '.'), and an optional extension (default is '.md'). It returns a new string with the given extension. If the delimiter is found in the input string, the function removes the part of the string after the last occurrence of the delimiter and appends the extension. If the delimiter is not found, the function simply appends the extension to the input string. This function can be used to generate file names for documentation files with the desired extension.

   Example usage:

   ```
   getFileName('example.txt'); // returns 'example.md'
   getFileName('example', '_', '.html'); // returns 'example.html'
   ```

2. `githubFileUrl(githubRoot, inputRoot, filePath, linkHosted)`: This function generates a GitHub URL for a file. It takes the GitHub repository root URL, the input root folder path, the file path, and a boolean flag indicating whether the URL should be for the hosted version of the file or the source code. It returns a string with the generated URL.

   Example usage:

   ```
   githubFileUrl('https://github.com/user/repo', '/input', '/input/example.md', true);
   // returns 'https://github.com/user/repo/example.md'
   ```

3. `githubFolderUrl(githubRoot, inputRoot, folderPath, linkHosted)`: This function is similar to `githubFileUrl`, but it generates a GitHub URL for a folder instead of a file. It takes the same arguments as `githubFileUrl` and returns a string with the generated URL.

   Example usage:

   ```
   githubFolderUrl('https://github.com/user/repo', '/input', '/input/folder', true);
   // returns 'https://github.com/user/repo/folder'
   ```

These utility functions can be used throughout the autodoc project to generate file names and GitHub URLs for documentation files and folders, ensuring consistent naming and URL generation across the project.
## Questions: 
 1. **What is the purpose of the `getFileName` function?**

   The `getFileName` function takes an input string, an optional delimiter, and an optional extension, and returns a new string with the given extension. If the delimiter is not found in the input string, the extension is simply appended to the input string. If the delimiter is found, the input string is sliced up to the last delimiter index and the extension is appended.

2. **What are the differences between the `githubFileUrl` and `githubFolderUrl` functions?**

   Both functions take the same parameters: `githubRoot`, `inputRoot`, a path (either `filePath` or `folderPath`), and a `linkHosted` boolean. The main difference is in the returned URL: `githubFileUrl` returns a URL pointing to a file in the GitHub repository, while `githubFolderUrl` returns a URL pointing to a folder in the GitHub repository. The URL structure differs slightly, with `/blob/master/` for files and `/tree/master/` for folders.

3. **What is the purpose of the `linkHosted` parameter in the `githubFileUrl` and `githubFolderUrl` functions?**

   The `linkHosted` parameter is a boolean that determines whether the returned URL should point to the hosted version of the file or folder on GitHub Pages (if `true`) or to the file or folder within the GitHub repository itself (if `false`). Depending on the value of `linkHosted`, the functions will return different URL structures.