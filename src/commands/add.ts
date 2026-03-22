import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import { getRulesPath, rulesExist } from "../lib/paths.js";
import { parseRulesMd, findCategory } from "../lib/parser.js";
import { addRule, generateRulesMd } from "../lib/writer.js";

export async function addCommand(categoryName?: string): Promise<void> {
  p.intro(pc.bold("arules") + " — add rule");

  if (!rulesExist()) {
    p.log.error("No rules.md found.");
    p.log.info(`Run ${pc.bold("arules init")} first.`);
    p.outro("");
    return;
  }

  let content = fs.readFileSync(getRulesPath(), "utf-8");
  const categories = parseRulesMd(content);

  // Get category name
  let targetCategory: string;
  if (categoryName) {
    targetCategory = categoryName;
  } else {
    const nameResult = await p.text({
      message: "Category name?",
      placeholder: "e.g., Coding",
      validate: (value) => {
        if (!value.trim()) return "Category name is required.";
        return undefined;
      },
    });
    if (p.isCancel(nameResult)) {
      p.outro("Cancelled.");
      return;
    }
    targetCategory = nameResult as string;
  }

  // If category doesn't exist, create it
  const existing = findCategory(categories, targetCategory);
  if (!existing) {
    p.log.info(`Creating new category: ${pc.bold(targetCategory)}`);
    categories.push({ name: targetCategory, rules: [] });
    content = generateRulesMd(categories);
  }

  // Get the rule
  const ruleResult = await p.text({
    message: "Rule:",
    placeholder: "e.g., Always write tests for new code",
    validate: (value) => {
      if (!value.trim()) return "Rule is required.";
      return undefined;
    },
  });
  if (p.isCancel(ruleResult)) {
    p.outro("Cancelled.");
    return;
  }
  const rule = (ruleResult as string).trim();

  // Write to rules.md
  const newContent = addRule(content, targetCategory, rule);
  fs.writeFileSync(getRulesPath(), newContent, "utf-8");

  p.log.success(
    `Added rule to ${pc.bold(targetCategory)}`,
  );
  p.outro("Done.");
}
