import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { getRulesPath, rulesExist, acoreExists } from "../lib/paths.js";
import { parseRulesMd } from "../lib/parser.js";

export function doctorCommand(): void {
  p.intro(pc.bold("arules doctor") + " — health check");

  let score = 10;

  // Check: rules.md exists
  if (rulesExist()) {
    p.log.success("rules.md exists");
  } else {
    p.log.error(
      "rules.md not found — run " + pc.bold("arules init") + " to create it",
    );
    score -= 3;
  }

  // Check: rules.md is parseable and has categories
  if (rulesExist()) {
    try {
      const content = fs.readFileSync(getRulesPath(), "utf-8");
      const categories = parseRulesMd(content);

      if (categories.length === 0) {
        p.log.warning("No categories defined — run " + pc.bold("arules add <category>"));
        score -= 2;
      } else {
        p.log.success(`${categories.length} categories defined`);

        // Check for empty categories
        const empty = categories.filter((c) => c.rules.length === 0);
        if (empty.length > 0) {
          p.log.warning(
            `${empty.length} category(s) have no rules: ${empty.map((c) => c.name).join(", ")}`,
          );
          score -= 1;
        }

        // Check total rules
        const totalRules = categories.reduce((sum, c) => sum + c.rules.length, 0);
        if (totalRules > 0) {
          p.log.success(`${totalRules} total rules defined`);
        }
      }
    } catch {
      p.log.error("rules.md could not be parsed");
      score -= 2;
    }
  }

  // Check: acore integration
  if (acoreExists()) {
    p.log.success("acore detected — identity layer connected");
  } else {
    p.log.info(
      "acore not found — run " +
        pc.bold("npx @aman_asmuei/acore") +
        " for AI identity",
    );
  }

  // Check: amem integration
  const amemDir = path.join(os.homedir(), ".amem");
  if (fs.existsSync(amemDir)) {
    p.log.success("amem detected — memory layer connected");
  } else {
    p.log.info(
      "amem not found — run " +
        pc.bold("npx @aman_asmuei/amem") +
        " for AI memory",
    );
  }

  // Check: akit integration
  const akitDir = path.join(os.homedir(), ".akit");
  if (fs.existsSync(akitDir)) {
    p.log.success("akit detected — tools layer connected");
  } else {
    p.log.info(
      "akit not found — run " +
        pc.bold("npx @aman_asmuei/akit") +
        " for AI tools",
    );
  }

  // Check: aflow integration
  const aflowDir = path.join(os.homedir(), ".aflow");
  if (fs.existsSync(aflowDir)) {
    p.log.success("aflow detected — workflows layer connected");
  } else {
    p.log.info(
      "aflow not found — run " +
        pc.bold("npx @aman_asmuei/aflow") +
        " for AI workflows",
    );
  }

  // Score
  score = Math.max(0, score);
  const scoreColor = score >= 8 ? pc.green : score >= 5 ? pc.yellow : pc.red;
  p.log.message("");
  p.log.info(`Score: ${scoreColor(`${score}/10`)}`);

  p.outro("");
}
