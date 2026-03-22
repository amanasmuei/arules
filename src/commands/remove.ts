import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import { getRulesPath, rulesExist } from "../lib/paths.js";
import { parseRulesMd } from "../lib/parser.js";
import { removeRule } from "../lib/writer.js";

export async function removeCommand(): Promise<void> {
  p.intro(pc.bold("arules") + " — remove rule");

  if (!rulesExist()) {
    p.log.error("No rules.md found.");
    p.log.info(`Run ${pc.bold("arules init")} first.`);
    p.outro("");
    return;
  }

  const content = fs.readFileSync(getRulesPath(), "utf-8");
  const categories = parseRulesMd(content);

  if (categories.length === 0) {
    p.log.info("No rule categories defined.");
    p.outro("");
    return;
  }

  // Select category
  const categoryResult = await p.select({
    message: "Which category?",
    options: categories.map((c) => ({
      value: c.name,
      label: `${c.name} (${c.rules.length} rules)`,
    })),
  });
  if (p.isCancel(categoryResult)) {
    p.outro("Cancelled.");
    return;
  }
  const categoryName = categoryResult as string;
  const category = categories.find((c) => c.name === categoryName);

  if (!category || category.rules.length === 0) {
    p.log.info(`No rules in ${pc.bold(categoryName)}.`);
    p.outro("");
    return;
  }

  // Select rule to remove
  const ruleResult = await p.select({
    message: "Which rule to remove?",
    options: category.rules.map((r, i) => ({
      value: String(i),
      label: r,
    })),
  });
  if (p.isCancel(ruleResult)) {
    p.outro("Cancelled.");
    return;
  }
  const ruleIndex = parseInt(ruleResult as string, 10);

  const newContent = removeRule(content, categoryName, ruleIndex);
  fs.writeFileSync(getRulesPath(), newContent, "utf-8");

  p.log.success(`Removed rule from ${pc.bold(categoryName)}`);
  p.log.success("Updated " + pc.dim(getRulesPath()));
  p.outro("Done.");
}
