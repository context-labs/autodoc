"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spinnerInfo = exports.spinnerSuccess = exports.spinnerError = exports.stopSpinner = exports.updateSpinnerText = void 0;
const ora_1 = __importDefault(require("ora"));
const spinner = (0, ora_1.default)({
    // make a singleton so we don't ever have 2 spinners
    spinner: 'dots',
});
const updateSpinnerText = (message) => {
    if (spinner.isSpinning) {
        spinner.text = message;
        return;
    }
    spinner.start(message);
};
exports.updateSpinnerText = updateSpinnerText;
const stopSpinner = () => {
    if (spinner.isSpinning) {
        spinner.stop();
    }
};
exports.stopSpinner = stopSpinner;
const spinnerError = (message) => {
    if (spinner.isSpinning) {
        spinner.fail(message);
    }
};
exports.spinnerError = spinnerError;
const spinnerSuccess = (message) => {
    if (spinner.isSpinning) {
        spinner.succeed(message);
    }
};
exports.spinnerSuccess = spinnerSuccess;
const spinnerInfo = (message) => {
    spinner.info(message);
};
exports.spinnerInfo = spinnerInfo;
//# sourceMappingURL=spinner.js.map