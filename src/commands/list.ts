import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import { getRulesPath, rulesExist } from "../lib/paths.js";
import { parseRulesMd } from "../lib/parser.js";

export function listCommand(): void {
  if (!rulesExist()) {
    p.intro(pc.bold("arules") + " — your rules");
    p.log.info("No rules.md found.");
    p.log.info(`Run ${pc.bold("arules init")} to create one with starter rules.`);
    p.outro("");
    return;
  }

  const content = fs.readFileSync(getRulesPath(), "utf-8");
  const categories = parseRulesMd(content);

  if (categories.length === 0) {
    p.intro(pc.bold("arules") + " — your rules");
    p.log.info("No rule categories defined yet.");
    p.log.info(`Run ${pc.bold("arules add <category>")} to create one.`);
    p.outro("");
    return;
  }

  p.intro(pc.bold("arules") + " — " + categories.length + " categories");

  for (const category of categories) {
    const ruleCount = category.rules.length;
    p.log.info(
      `${pc.bold(category.name)} — ${ruleCount} rule${ruleCount !== 1 ? "s" : ""}`,
    );
  }

  p.log.message("");
  p.log.info(`Run ${pc.bold("arules show <category>")} to see rules in a category.`);

  p.outro("");
}
