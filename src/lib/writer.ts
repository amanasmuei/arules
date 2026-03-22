import type { RuleCategory } from "./parser.js";

/**
 * Generate a complete rules.md from structured rule categories.
 */
export function generateRulesMd(categories: RuleCategory[]): string {
  const parts = ["# My AI Rules"];

  for (const category of categories) {
    parts.push("");
    parts.push(`## ${category.name}`);
    for (const rule of category.rules) {
      parts.push(`- ${rule}`);
    }
  }

  return parts.join("\n") + "\n";
}

/**
 * Add a rule to an existing category in rules.md content.
 * Returns the new content string.
 */
export function addRule(
  content: string,
  category: string,
  rule: string,
): string {
  const lines = content.split("\n");
  const result: string[] = [];
  let added = false;
  let inTargetCategory = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this is the target category heading
    const headingMatch = line.match(/^## (.+)$/);
    if (headingMatch) {
      if (headingMatch[1].trim().toLowerCase() === category.toLowerCase()) {
        inTargetCategory = true;
      } else {
        // If we were in the target category and hit a new heading, insert rule before it
        if (inTargetCategory && !added) {
          result.push(`- ${rule}`);
          added = true;
        }
        inTargetCategory = false;
      }
    }

    result.push(line);

    // If this is the last rule line in the target category, insert after it
    if (inTargetCategory && line.match(/^- .+$/) && !added) {
      // Look ahead: if next line is not a rule, insert after this line
      const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
      if (!nextLine.match(/^- .+$/)) {
        result.push(`- ${rule}`);
        added = true;
      }
    }
  }

  // If category was the last one and we haven't added yet
  if (inTargetCategory && !added) {
    result.push(`- ${rule}`);
  }

  return result.join("\n");
}

/**
 * Remove a rule from a category in rules.md content by index (0-based).
 * Returns the new content string.
 */
export function removeRule(
  content: string,
  category: string,
  ruleIndex: number,
): string {
  const lines = content.split("\n");
  const result: string[] = [];
  let inTargetCategory = false;
  let currentRuleIndex = 0;

  for (const line of lines) {
    // Check if this is a heading
    const headingMatch = line.match(/^## (.+)$/);
    if (headingMatch) {
      if (headingMatch[1].trim().toLowerCase() === category.toLowerCase()) {
        inTargetCategory = true;
        currentRuleIndex = 0;
      } else {
        inTargetCategory = false;
      }
      result.push(line);
      continue;
    }

    // If in target category and this is a rule line
    if (inTargetCategory && line.match(/^- .+$/)) {
      if (currentRuleIndex === ruleIndex) {
        // Skip this line (remove it)
        currentRuleIndex++;
        continue;
      }
      currentRuleIndex++;
    }

    result.push(line);
  }

  return result.join("\n");
}
