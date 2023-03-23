import { Command } from 'commander';
import { spinnerSuccess, updateSpinnerText } from '../../spinner';
import { processRepository } from './processRepository';

export const ingest = new Command('ingest');

ingest.command('ingest').action(async () => {
  updateSpinnerText('Processing ');
  processRepository();
  spinnerSuccess();
  // console.table([{ id: 1, name: "Tommy" }, { id: 2, name: "Bob" }]);
});
