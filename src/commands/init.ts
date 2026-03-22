import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getRulesPath, rulesExist, ensureGlobalDir } from "../lib/paths.js";

export function initCommand(): void {
  p.intro(pc.bold("arules") + " — setup");

  if (rulesExist()) {
    p.log.warning("rules.md already exists at " + pc.dim(getRulesPath()));
    p.log.info(`Run ${pc.bold("arules list")} to see your rule categories.`);
    p.outro("");
    return;
  }

  ensureGlobalDir();

  // Copy starter template
  const templatePath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "template",
    "rules-starter.md",
  );

  let templateContent: string;
  try {
    templateContent = fs.readFileSync(templatePath, "utf-8");
  } catch {
    // Fallback if template not found (shouldn't happen in normal install)
    templateContent = "# My AI Rules\n";
  }

  fs.writeFileSync(getRulesPath(), templateContent, "utf-8");

  p.log.success("Created " + pc.dim(getRulesPath()));
  p.log.info("6 starter categories included: Always, Never, Coding, Communication, Data, Team");
  p.log.info(`Run ${pc.bold("arules list")} to see them.`);
  p.log.info(`Run ${pc.bold("arules add <category>")} to add your own rules.`);

  p.outro("Done.");
}
