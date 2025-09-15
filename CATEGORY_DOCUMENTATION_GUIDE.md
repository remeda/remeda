# Category Documentation Guide

Agent-to-agent guidance for comprehensive category documentation work. This is a two-phase process: **primarily** creating Lodash migration guides, then **secondarily** improving Remeda's own function docs.

**CRITICAL**: Don't underestimate Phase 1. The Lodash migration work is the main effort - you'll spend most of your time here, going function-by-function through every Lodash function in the category. Phase 2 is cleanup work that builds on discoveries from Phase 1.

## Phase 1: Lodash Migration Analysis (PRIMARY FOCUS - 70% of effort)

### 1.1 Map All Lodash Functions in Category

**Your first task**: Go to Lodash docs, enumerate EVERY function in the target category. Don't skip any. You'll be surprised how many exist.

- **Search pattern**: Use `@see https://lodash.com/docs/4.17.15#[FUNCTION]` to find existing migration docs
- **Create a spreadsheet mindset**: For each function, note: Has migration doc? Remeda equivalent? Level of complexity?
- **Categorize ruthlessly**:
  - Direct 1:1 mappings (easy)
  - Partial equivalents (medium)
  - No equivalent/"not provided" (hard - needs alternatives)
  - Security-deprecated (explain why)

**Time estimate**: 2-3 hours for a typical category. Yes, really.

### 1.2 Deep Function-by-Function Analysis

**This is where the real work happens**. For each Lodash function:

**Parameter Analysis**:

- Read both Lodash and Remeda source code - don't trust docs alone
- **Test edge cases manually**: What happens with `null`, `undefined`, empty strings?
- **Parameter order matters**: Lodash is often inconsistent, Remeda is data-first or data-last
- **Missing parameters**: Remeda often doesn't expose all native method parameters

**Type Safety Investigation**:

- How does Remeda's TypeScript improve on Lodash's loose typing?
- What runtime coercion does Lodash do that Remeda avoids?
- Are there template literal types that provide better intellisense?

**Alternative Research** (crucial for "not provided" functions):

- **Native JavaScript**: What ES2015+ features replace the utility?
- **CSS properties**: Can styling solve this instead of JavaScript?
- **Modern APIs**: `Intl.*`, `URL`, newer browser features
- **Security reasoning**: Why might we deliberately not provide this?

### 1.3 Migration Guide Writing Strategy

**You'll be writing A LOT of migration docs**. Here's how to stay sane:

**For Functions Remeda Provides**:

```markdown
## migrating from lodash

### `_.someFunction(data, ...args)` → `R.someFunction(data, ...args)`

[Parameter differences explanation]
[Edge case differences]
[Type safety improvements]
[Composition patterns if needed]
```

**For Functions Remeda Doesn't Provide**:

```markdown
## migrating from lodash

Remeda doesn't provide an equivalent for `_.someFunction` because [reason].

### native alternatives

[Native JS code examples]

### css alternatives

[CSS properties that solve the use case]

### modern approaches

[Newer APIs, frameworks, libraries]
```

**Writing efficiency**: Create templates and reuse patterns. You'll write dozens of these.

### 1.4 Extract Patterns That Apply to Multiple Functions

**By the end of Phase 1, you should see patterns**:

- **Parameter patterns**: How does data-first vs data-last affect migration?
- **Type coercion patterns**: Where does Lodash's loose typing cause migration friction?
- **Native replacement patterns**: Which modern APIs consistently replace utility needs?
- **CSS replacement patterns**: Which utility functions are better solved with styling?
- **Security patterns**: Which functions are deprecated for good reason?

**Document these patterns**: They'll inform your Phase 2 work and help future agents.

## Phase 2: Remeda Function Documentation (SECONDARY - 30% of effort)

**Important**: You only do this phase AFTER completing Phase 1. The migration work will teach you things about Remeda's functions that the docs/code/tests won't reveal.

### 2.1 Map the Remeda Category Functions

**Use the Grep tool**: `pattern: "@category YourCategory"` to find all functions.

**Quick classification**:

- **Direct wrappers**: Functions that just call native methods (need "wrapper" language)
- **Complex implementations**: Functions with custom logic (need behavior descriptions)
- **Partial wrappers**: Wrappers that don't expose all native parameters (need composition workarounds)

**Cross-reference with Phase 1**: Which Remeda functions were mentioned in migration guides? What did you learn about their limitations or strengths?

### 2.2 Fix Documentation Anti-Patterns

**Watch for these common issues you'll need to fix**:

**Anti-Pattern**: "This function handles Unicode correctly" → **Fix**: Remove defensive language
**Anti-Pattern**: "Works with all edge cases" → **Fix**: Be specific about what it does, not what it "works" with  
**Anti-Pattern**: Parameter docs that just repeat the parameter name → **Fix**: Add meaningful descriptions
**Anti-Pattern**: Missing wrapper acknowledgment → **Fix**: "This function is a wrapper around the built-in X method"
**Anti-Pattern**: Vague limitations → **Fix**: Specific constraints with alternatives

**Read tests religiously**: Tests often contradict documentation claims about limitations.

## Agent Success Checklist

### Migration Documentation Quality Check

**You've succeeded if**:

- ✅ Every Lodash function in the category has a migration path documented
- ✅ "Not provided" functions have clear reasoning + 2-3 alternatives
- ✅ Parameter differences are demonstrated with concrete examples
- ✅ Type safety improvements are highlighted with before/after code
- ✅ Security-deprecated functions explain the risk and solution

### Remeda Documentation Quality Check

**You've succeeded if**:

- ✅ Wrapper functions explicitly state they wrap built-in methods
- ✅ Missing native parameters are documented with composition alternatives
- ✅ First paragraphs work for LLM extraction (concise, clear purpose)
- ✅ No defensive language ("handles correctly", "works with")
- ✅ Parameter descriptions add value beyond parameter names
- ✅ Cross-references between related functions are accurate

## Tactical Advice for Maximum Efficiency

### Time Management

**Phase 1 (Lodash migration)**: Budget 4-6 hours for a typical category
**Phase 2 (Remeda docs)**: Budget 2-3 hours for cleanup work
**Total**: 6-9 hours for comprehensive category work

### Tool Usage Patterns

**Use Grep extensively**: `pattern: "lodash.*functionName"` to find existing migration docs
**Use Read + WebFetch**: Read source, read tests, fetch Lodash docs for comparison
**Use TodoWrite**: Track progress through dozens of functions - easy to lose track
**Batch your tool calls**: Read multiple files at once, make multiple edits in parallel

### Document Discoveries As You Go

**Don't wait until the end to capture patterns**. As you work through functions, immediately note:

- **Locale accuracy patterns**: Which functions have locale inaccuracies? How consistent is this across the category?
- **CSS replacement opportunities**: When does styling solve the use case better than JavaScript?
- **Security deprecation reasons**: Why are certain Lodash functions discouraged? Document the reasoning clearly.
- **Native API evolution**: Which browser features have superseded utility needs? Note the timeline.
- **Type safety improvements**: How does Remeda's TypeScript provide better developer experience?

**Create a running "patterns discovered" document** alongside your migration work. These insights will directly inform your Phase 2 Remeda documentation improvements and help future agents working on other categories.

### Common Pitfalls

❌ **Don't**: Skip the systematic Lodash enumeration - you'll miss functions
❌ **Don't**: Trust existing docs over source code and tests
❌ **Don't**: Write defensive language ("handles correctly", "works with all cases")
❌ **Don't**: Create parameter descriptions that just repeat parameter names
❌ **Don't**: Assume wrapper functions are complete - check for missing parameters

✅ **Do**: Start with comprehensive Lodash mapping before touching Remeda docs  
✅ **Do**: Read tests to understand actual capabilities vs documented limitations
✅ **Do**: Provide concrete alternatives for "not provided" functions
✅ **Do**: State clearly when functions are wrappers around built-in methods
✅ **Do**: Document composition patterns for missing native parameters

### Writing Templates That Work

**Wrapper function template**:
"This function is a wrapper around the built-in [`NativeMethod`](link) method, but doesn't expose the `missingParam` parameter. To use that parameter, use `composition(example, withMissingParam)`."

**Complex function template**:
"[What it does] for [intended use case]. [Specific limitations] with [alternatives]. For [other use cases], prefer [better solution]."

**Before you finish, validate your work**:

1. **Migration completeness**: Can someone migrate their entire category from Lodash using your docs?
2. **Alternative quality**: Are "not provided" functions well-explained with actionable alternatives?
3. **Remeda accuracy**: Do the function docs match what the source code and tests actually do?
4. **Consistency**: Do all wrapper functions follow the same documentation pattern?
5. **User experience**: Would a developer find these docs helpful rather than defensive or confusing?

## Final Agent-to-Agent Notes

**This work is harder than it looks**. The Lodash ecosystem is vast and inconsistent. Remeda's design philosophy differs significantly. Don't underestimate the research phase.

**The migration work teaches you everything**. Patterns you discover analyzing Lodash vs Remeda will directly inform how to fix Remeda's own documentation. Don't skip to Phase 2.

**Quality over speed**. Better to thoroughly document 80% of functions than to hastily cover 100%. Users care about the functions they actually use.

**Test your assumptions**. Both Lodash and Remeda docs can be wrong or outdated. Source code and tests are the source of truth.

**Future agent**: When you use this guide, improve it based on what you learn. Document new patterns, better templates, time-saving shortcuts. Make it easier for the next agent.
