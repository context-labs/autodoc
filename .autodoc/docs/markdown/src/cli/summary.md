[View code on GitHub](https://github.com/context-labs/autodoc/.autodoc/docs/json/src/cli)

The `spinner.ts` file in the `.autodoc/docs/json/src/cli` folder provides a utility for managing a command-line spinner using the `ora` library. The spinner is a visual indicator that displays a series of characters in a loop, giving the user feedback that a process is running in the background. The code exports several functions to control the spinner's behavior, such as updating the text, stopping the spinner, and displaying success, error, or informational messages.

The `spinner` object is created as a singleton to ensure that there is only one instance of the spinner at any given time. This prevents multiple spinners from being displayed simultaneously, which could cause confusion for the user. The spinner is configured to use the 'dots' style.

The `updateSpinnerText` function is used to update the spinner's text. If the spinner is already spinning, it updates the text directly; otherwise, it starts the spinner with the given message. For example:

```javascript
updateSpinnerText('Loading data...');
```

The `stopSpinner` function stops the spinner if it is currently spinning:

```javascript
stopSpinner();
```

The `spinnerError`, `spinnerSuccess`, and `spinnerInfo` functions are used to display error, success, and informational messages, respectively. These functions first check if the spinner is spinning and then call the appropriate `ora` method to display the message with the corresponding status symbol (e.g., a red cross for errors, a green checkmark for success, etc.):

```javascript
spinnerError('An error occurred');
spinnerSuccess('Operation completed successfully');
spinnerInfo('Please wait...');
```

In the larger project, this utility can be used to provide a consistent and user-friendly interface for displaying progress and status messages during long-running tasks or processes.
