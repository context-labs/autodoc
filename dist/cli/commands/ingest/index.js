"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingest = void 0;
const spinner_1 = require("../../spinner");
const processRepository_1 = require("./processRepository");
const ingest = () => {
    (0, processRepository_1.processRepository)('clockwork', 'https://github.com/clockwork-xyz/clockwork', '.', 'autodoc');
    (0, spinner_1.spinnerSuccess)();
    // console.table([{ id: 1, name: "Tommy" }, { id: 2, name: "Bob" }]);
};
exports.ingest = ingest;
exports.default = {
    ingest: exports.ingest,
};
//# sourceMappingURL=index.js.map