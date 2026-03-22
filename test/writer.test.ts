import { describe, it, expect } from "vitest";
import { generateRulesMd, addRule, removeRule } from "../src/lib/writer.js";
import { parseRulesMd } from "../src/lib/parser.js";
import type { RuleCategory } from "../src/lib/parser.js";

const sampleCategory: RuleCategory = {
  name: "Coding",
  rules: [
    "Follow existing code style and conventions",
    "Prefer simple solutions over clever ones",
    "Write tests for new functionality",
  ],
};

describe("generateRulesMd", () => {
  it("generates valid rules.md from categories", () => {
    const result = generateRulesMd([sampleCategory]);
    expect(result).toContain("# My AI Rules");
    expect(result).toContain("## Coding");
    expect(result).toContain("- Follow existing code style and conventions");
    expect(result).toContain("- Prefer simple solutions over clever ones");
    expect(result).toContain("- Write tests for new functionality");
  });

  it("generates multiple categories", () => {
    const second: RuleCategory = {
      name: "Data",
      rules: ["Never log personal information"],
    };
    const result = generateRulesMd([sampleCategory, second]);
    expect(result).toContain("## Coding");
    expect(result).toContain("## Data");
  });

  it("roundtrips through parser", () => {
    const categories = [
      sampleCategory,
      {
        name: "Always",
        rules: [
          "Ask before deleting",
          "Explain reasoning",
        ],
      },
    ];
    const generated = generateRulesMd(categories);
    const parsed = parseRulesMd(generated);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe("Coding");
    expect(parsed[0].rules).toHaveLength(3);
    expect(parsed[1].name).toBe("Always");
    expect(parsed[1].rules).toHaveLength(2);
  });

  it("returns just header for empty array", () => {
    const result = generateRulesMd([]);
    expect(result.trim()).toBe("# My AI Rules");
  });
});

describe("addRule", () => {
  const baseContent = `# My AI Rules

## Always
- Ask before deleting files or data
- Explain your reasoning before making changes
`;

  it("adds a rule to an existing category", () => {
    const result = addRule(baseContent, "Always", "Flag security concerns");
    expect(result).toContain("- Ask before deleting files or data");
    expect(result).toContain("- Flag security concerns");
  });

  it("preserves existing rules", () => {
    const result = addRule(baseContent, "Always", "New rule");
    const parsed = parseRulesMd(result);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].rules).toHaveLength(3);
    expect(parsed[0].rules[0]).toBe("Ask before deleting files or data");
    expect(parsed[0].rules[1]).toBe("Explain your reasoning before making changes");
    expect(parsed[0].rules[2]).toBe("New rule");
  });

  it("adds to correct category when multiple exist", () => {
    const content = `# My AI Rules

## Always
- Rule A

## Never
- Rule B
`;
    const result = addRule(content, "Never", "Rule C");
    const parsed = parseRulesMd(result);
    expect(parsed[0].rules).toHaveLength(1);
    expect(parsed[1].rules).toHaveLength(2);
    expect(parsed[1].rules[1]).toBe("Rule C");
  });
});

describe("removeRule", () => {
  const content = `# My AI Rules

## Always
- Ask before deleting files or data
- Explain your reasoning
- Flag security concerns

## Never
- Push directly to main
- Expose secrets
`;

  it("removes a rule by index", () => {
    const result = removeRule(content, "Always", 1);
    const parsed = parseRulesMd(result);
    expect(parsed[0].rules).toHaveLength(2);
    expect(parsed[0].rules[0]).toBe("Ask before deleting files or data");
    expect(parsed[0].rules[1]).toBe("Flag security concerns");
  });

  it("removes the first rule", () => {
    const result = removeRule(content, "Always", 0);
    const parsed = parseRulesMd(result);
    expect(parsed[0].rules).toHaveLength(2);
    expect(parsed[0].rules[0]).toBe("Explain your reasoning");
  });

  it("removes the last rule", () => {
    const result = removeRule(content, "Always", 2);
    const parsed = parseRulesMd(result);
    expect(parsed[0].rules).toHaveLength(2);
    expect(parsed[0].rules[1]).toBe("Explain your reasoning");
  });

  it("only removes from the specified category", () => {
    const result = removeRule(content, "Never", 0);
    const parsed = parseRulesMd(result);
    expect(parsed[0].rules).toHaveLength(3); // Always unchanged
    expect(parsed[1].rules).toHaveLength(1);
    expect(parsed[1].rules[0]).toBe("Expose secrets");
  });
});
