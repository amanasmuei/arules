import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import { getRulesPath, rulesExist } from "../lib/paths.js";
import { parseRulesMd, findCategory } from "../lib/parser.js";

export function showCommand(name?: string): void {
  if (!rulesExist()) {
    p.intro(pc.bold("arules show"));
    p.log.info("No rules.md found.");
    p.log.info(`Run ${pc.bold("arules init")} to create one.`);
    p.outro("");
    return;
  }

  const content = fs.readFileSync(getRulesPath(), "utf-8");

  // If no name given, show the full file
  if (!name) {
    p.intro(pc.bold("arules") + " — rules.md");
    console.log(content);
    p.outro("");
    return;
  }

  const categories = parseRulesMd(content);
  const category = findCategory(categories, name);

  if (!category) {
    p.intro(pc.bold("arules show"));
    p.log.error(`Category "${name}" not found.`);
    p.log.info(`Run ${pc.bold("arules list")} to see available categories.`);
    p.outro("");
    return;
  }

  p.intro(pc.bold("arules") + " — " + pc.cyan(category.name));

  if (category.rules.length === 0) {
    p.log.info("No rules defined in this category.");
  } else {
    for (let i = 0; i < category.rules.length; i++) {
      p.log.info(`${pc.dim(`${i + 1}.`)} ${category.rules[i]}`);
    }
  }

  p.outro("");
}
