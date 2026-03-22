import { describe, it, expect } from "vitest";
import { parseRulesMd, findCategory } from "../src/lib/parser.js";

const SAMPLE_RULES = `# My AI Rules

## Always
- Ask before deleting files or data
- Explain your reasoning before making changes
- Flag security concerns immediately

## Never
- Push directly to main/master without approval
- Expose secrets, API keys, or credentials in code
- Make changes to production systems without confirmation
- Skip tests when fixing bugs

## Coding
- Follow existing code style and conventions
- Prefer simple solutions over clever ones
- Write tests for new functionality
- Keep PRs focused and small
`;

describe("parseRulesMd", () => {
  it("parses categories from rules.md content", () => {
    const categories = parseRulesMd(SAMPLE_RULES);
    expect(categories).toHaveLength(3);
  });

  it("extracts category names", () => {
    const categories = parseRulesMd(SAMPLE_RULES);
    expect(categories[0].name).toBe("Always");
    expect(categories[1].name).toBe("Never");
    expect(categories[2].name).toBe("Coding");
  });

  it("extracts rules", () => {
    const categories = parseRulesMd(SAMPLE_RULES);
    expect(categories[0].rules).toHaveLength(3);
    expect(categories[0].rules[0]).toBe("Ask before deleting files or data");
    expect(categories[0].rules[2]).toBe("Flag security concerns immediately");
  });

  it("handles Never category with 4 rules", () => {
    const categories = parseRulesMd(SAMPLE_RULES);
    expect(categories[1].rules).toHaveLength(4);
    expect(categories[1].rules[3]).toBe("Skip tests when fixing bugs");
  });

  it("returns empty array for empty content", () => {
    expect(parseRulesMd("")).toEqual([]);
  });

  it("returns empty array for content with only a title", () => {
    expect(parseRulesMd("# My AI Rules\n")).toEqual([]);
  });

  it("handles category with no rules", () => {
    const content = `# My AI Rules\n\n## Empty\n`;
    const categories = parseRulesMd(content);
    expect(categories).toHaveLength(1);
    expect(categories[0].name).toBe("Empty");
    expect(categories[0].rules).toHaveLength(0);
  });

  it("preserves rule text with special characters", () => {
    const content = `# Rules\n\n## Test\n- Check for bugs — they're sneaky\n- Run tests (unit + integration)\n`;
    const categories = parseRulesMd(content);
    expect(categories[0].rules[0]).toBe("Check for bugs — they're sneaky");
    expect(categories[0].rules[1]).toBe("Run tests (unit + integration)");
  });
});

describe("findCategory", () => {
  const categories = parseRulesMd(SAMPLE_RULES);

  it("finds a category by exact name", () => {
    const result = findCategory(categories, "Always");
    expect(result).toBeDefined();
    expect(result!.name).toBe("Always");
  });

  it("finds a category case-insensitively", () => {
    const result = findCategory(categories, "always");
    expect(result).toBeDefined();
    expect(result!.name).toBe("Always");
  });

  it("returns undefined for unknown category", () => {
    expect(findCategory(categories, "nonexistent")).toBeUndefined();
  });

  it("does not match partial names", () => {
    expect(findCategory(categories, "Al")).toBeUndefined();
  });
});
