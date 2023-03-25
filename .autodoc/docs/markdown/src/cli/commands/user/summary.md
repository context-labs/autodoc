[View code on GitHub](https://github.com/context-labs/autodoc/tree/master/.autodoc/docs/json/src/cli/commands/user)

The `index.ts` file in the `user` folder is responsible for handling user configuration of the `autodoc` tool. It provides two main functions: `makeConfigTemplate` and `user`.

The `makeConfigTemplate` function is used to create a default configuration object called `AutodocUserConfig`. It takes an optional `config` object as an argument. If `config` is provided, the `llms` property of the new object is set to the value of `config.llms`. Otherwise, the `llms` property is set to an array containing the `LLMModels.GPT3` value.

```typescript
function makeConfigTemplate(config?: Partial<AutodocUserConfig>): AutodocUserConfig {
  // ...
}
```

The `user` function is an asynchronous function that takes an optional `config` object as an argument. It is responsible for prompting the user to select which LLMs they have access to and writing the resulting configuration to a file. The `userConfigFilePath` and `userConfigFileName` constants are used to specify the location and name of the configuration file, respectively.

```typescript
async function user(config?: Partial<AutodocUserConfig>): Promise<void> {
  // ...
}
```

The `user` function first checks if a user configuration file already exists at `userConfigFilePath`. If it does, the function prompts the user to confirm whether they want to overwrite the existing file. If the user chooses not to continue, the function exits. Otherwise, the function creates the directory containing the configuration file if it does not already exist.

Next, the function prompts the user to select which LLMs they have access to using the `inquirer` library. The choices are presented as a list of options, each with a name and a value. The `llms` property of the `config` object is set to the selected value.

```typescript
const { llms } = await inquirer.prompt([
  {
    type: "list",
    name: "llms",
    message: "Which LLMs do you have access to?",
    choices: [
      // ...
    ],
  },
]);
```

The `newConfig` object is created by calling `makeConfigTemplate` with the updated `llms` property and the rest of the properties from the original `config` object. The `newConfig` object is then written to the user configuration file using the `fs` library.

```typescript
const newConfig = makeConfigTemplate({ ...config, llms });
fs.writeFileSync(userConfigFilePath, JSON.stringify(newConfig, null, 2));
```

Finally, a success message is printed to the console.

This code is essential for configuring the `autodoc` tool based on the user's preferences and available LLMs. The `makeConfigTemplate` function can be used to create a default configuration object, while the `user` function can be called to prompt the user to select which LLMs they have access to and write the resulting configuration to a file.
