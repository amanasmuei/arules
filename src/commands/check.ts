import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import { getRulesPath, rulesExist } from "../lib/paths.js";
import { parseRulesMd } from "../lib/parser.js";

export function checkCommand(): void {
  p.intro(pc.bold("arules check") + " — validate rules.md");

  if (!rulesExist()) {
    p.log.error("No rules.md found.");
    p.log.info(`Run ${pc.bold("arules init")} to create one.`);
    p.outro("");
    return;
  }

  const content = fs.readFileSync(getRulesPath(), "utf-8");
  let issues = 0;

  // Check: has title
  if (!content.match(/^# .+/m)) {
    p.log.warning("Missing top-level heading (# title)");
    issues++;
  } else {
    p.log.success("Has top-level heading");
  }

  // Check: parseable
  const categories = parseRulesMd(content);
  if (categories.length === 0) {
    p.log.warning("No categories found — add sections with ## headings");
    issues++;
  } else {
    p.log.success(`${categories.length} categories found`);
  }

  // Check: empty categories
  const empty = categories.filter((c) => c.rules.length === 0);
  if (empty.length > 0) {
    p.log.warning(
      `${empty.length} empty category(s): ${empty.map((c) => c.name).join(", ")}`,
    );
    issues++;
  } else if (categories.length > 0) {
    p.log.success("All categories have rules");
  }

  // Check: total rules count
  const totalRules = categories.reduce((sum, c) => sum + c.rules.length, 0);
  if (totalRules > 0) {
    p.log.success(`${totalRules} total rules defined`);
  }

  // Check: duplicate category names
  const names = categories.map((c) => c.name.toLowerCase());
  const dupes = names.filter((n, i) => names.indexOf(n) !== i);
  if (dupes.length > 0) {
    p.log.warning(`Duplicate categories: ${[...new Set(dupes)].join(", ")}`);
    issues++;
  } else if (categories.length > 1) {
    p.log.success("No duplicate categories");
  }

  p.log.message("");
  if (issues === 0) {
    p.log.success(pc.green("rules.md is valid"));
  } else {
    p.log.warning(`${issues} issue${issues !== 1 ? "s" : ""} found`);
  }

  p.outro("");
}
