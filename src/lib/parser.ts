export interface RuleCategory {
  name: string;
  rules: string[];
}

/**
 * Parse a rules.md file into structured rule categories.
 */
export function parseRulesMd(content: string): RuleCategory[] {
  const categories: RuleCategory[] = [];
  const lines = content.split("\n");

  let current: RuleCategory | null = null;

  for (const line of lines) {
    // Match ## category-name
    const headingMatch = line.match(/^## (.+)$/);
    if (headingMatch) {
      if (current) {
        categories.push(current);
      }
      current = {
        name: headingMatch[1].trim(),
        rules: [],
      };
      continue;
    }

    if (!current) continue;

    // Match rule line: "- Some rule"
    const ruleMatch = line.match(/^- (.+)$/);
    if (ruleMatch) {
      current.rules.push(ruleMatch[1].trim());
      continue;
    }
  }

  // Push the last category
  if (current) {
    categories.push(current);
  }

  return categories;
}

/**
 * Find a category by name (case-insensitive).
 */
export function findCategory(
  categories: RuleCategory[],
  name: string,
): RuleCategory | undefined {
  return categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
}
