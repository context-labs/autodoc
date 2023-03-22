import { Command } from "commander";
import { spinnerError, spinnerInfo, spinnerSuccess, updateSpinnerText } from "../spinner";

export const ingest = new Command("ingest");


ingest.command("ingest")
.action(async () => {
  updateSpinnerText("Processing ");
  // do work
  console.log('hit here');
  await new Promise(resolve => setTimeout(resolve, 1000)); // emulate work
  spinnerSuccess()
  console.table([{ id: 1, name: "Tommy" }, { id: 2, name: "Bob" }]);
})

// widgets.command("get")
//   .argument("<id>", "the id of the widget")
//   .option("-f, --format <format>", "the format of the widget") // an optional flag, this will be in options.f
//   .action(async (id, options) => {
//     updateSpinnerText("Getting widget " + id);
//     await new Promise(resolve => setTimeout(resolve, 3000));
//     spinnerSuccess()
//     console.table({ id: 1, name: "Tommy" })
//   })