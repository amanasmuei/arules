import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { listCommand } from "./commands/list.js";
import { showCommand } from "./commands/show.js";
import { addCommand } from "./commands/add.js";
import { removeCommand } from "./commands/remove.js";
import { checkCommand } from "./commands/check.js";
import { doctorCommand } from "./commands/doctor.js";
import { rulesExist } from "./lib/paths.js";

declare const __VERSION__: string;

const program = new Command();

program
  .name("arules")
  .description("The portable guardrails layer for AI companions")
  .version(__VERSION__)
  .action(() => {
    if (rulesExist()) {
      listCommand();
    } else {
      initCommand();
    }
  });

program
  .command("init")
  .description("Create rules.md with starter rules")
  .action(() => initCommand());

program
  .command("list")
  .description("List all rule categories")
  .action(() => listCommand());

program
  .command("show [category]")
  .description("Show rules in a category")
  .action((category?: string) => showCommand(category));

program
  .command("add [category]")
  .description("Add a new rule to a category interactively")
  .action((category?: string) => addCommand(category));

program
  .command("remove")
  .description("Remove a rule interactively")
  .action(() => removeCommand());

program
  .command("check")
  .description("Validate rules.md structure")
  .action(() => checkCommand());

program
  .command("doctor")
  .description("Health check")
  .action(() => doctorCommand());

program.parse();
