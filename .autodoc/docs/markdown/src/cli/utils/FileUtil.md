[View code on GitHub](https://github.com/context-labs/autodoc/src/cli/utils/FileUtil.ts)

This code provides utility functions for handling file and folder paths in the autodoc project. The main purpose of these functions is to generate file names and GitHub URLs for files and folders.

1. `getFileName(input: string, delimiter = '.', extension = '.md'): string`: This function takes an input string, an optional delimiter (default is '.'), and an optional extension (default is '.md'). It returns a new file name with the given extension. If the delimiter is not found in the input string, the function appends the extension to the input string. If the delimiter is found, the function replaces the part after the last delimiter with the extension. For example:

   ```javascript
   getFileName("example.txt"); // returns "example.md"
   getFileName("example"); // returns "example.md"
   ```

2. `githubFileUrl(githubRoot: string, inputRoot: string, filePath: string, linkHosted: boolean): string`: This function generates a GitHub URL for a file. It takes the GitHub root URL, the input root path, the file path, and a boolean flag `linkHosted`. If `linkHosted` is true, the function returns a URL pointing to the hosted version of the file. If `linkHosted` is false, the function returns a URL pointing to the file in the GitHub repository. For example:

   ```javascript
   githubFileUrl("https://github.com/user/repo", "/input", "/input/example.md", true); // returns "https://github.com/user/repo/example.md"
   githubFileUrl("https://github.com/user/repo", "/input", "/input/example.md", false); // returns "https://github.com/user/repo/blob/master/example.md"
   ```

3. `githubFolderUrl(githubRoot: string, inputRoot: string, folderPath: string, linkHosted: boolean): string`: This function is similar to `githubFileUrl`, but it generates a GitHub URL for a folder instead of a file. If `linkHosted` is true, the function returns a URL pointing to the hosted version of the folder. If `linkHosted` is false, the function returns a URL pointing to the folder in the GitHub repository. For example:

   ```javascript
   githubFolderUrl("https://github.com/user/repo", "/input", "/input/folder", true); // returns "https://github.com/user/repo/folder"
   githubFolderUrl("https://github.com/user/repo", "/input", "/input/folder", false); // returns "https://github.com/user/repo/tree/master/folder"
   ```

These utility functions can be used in the autodoc project to generate file names and URLs for documentation files and folders, making it easier to manage and navigate the documentation structure.
## Questions: 
 1. **What does the `getFileName` function do?**

   The `getFileName` function takes an input string, an optional delimiter (default is '.'), and an optional extension (default is '.md'). It returns the input string with the specified extension, replacing the part after the last occurrence of the delimiter if it exists.

2. **What is the purpose of the `githubFileUrl` and `githubFolderUrl` functions?**

   Both `githubFileUrl` and `githubFolderUrl` functions are used to generate URLs for files and folders, respectively, in a GitHub repository. They take a `githubRoot`, `inputRoot`, a `filePath` or `folderPath`, and a `linkHosted` boolean flag. If `linkHosted` is true, the generated URL will point to the hosted version of the file or folder; otherwise, it will point to the file or folder in the GitHub repository.

3. **Why is the `inputRoot.length - 1` used in the `substring` method for both `githubFileUrl` and `githubFolderUrl` functions?**

   The `inputRoot.length - 1` is used to remove the `inputRoot` part from the `filePath` or `folderPath` when generating the final URL. This ensures that the generated URL only contains the relevant path relative to the GitHub repository root.