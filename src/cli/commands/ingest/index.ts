import { AutodocConfig } from '../../../types';
import { spinnerSuccess, updateSpinnerText } from '../../spinner';
import { processRepository } from './processRepository';

export const ingest = (config: AutodocConfig) => {
  processRepository(config);
  spinnerSuccess();
  // console.table([{ id: 1, name: "Tommy" }, { id: 2, name: "Bob" }]);
};

export default {
  ingest,
};
