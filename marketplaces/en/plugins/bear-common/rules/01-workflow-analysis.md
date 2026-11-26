# Analysis Before Code

Before any change (feature, fix, refactor), analyze first. Mandatory.

1. **Understand**: goal, acceptance criteria, constraints, user impact.
2. **Analyze**: read the files involved, their dependents, tests and migrations.
3. **Document**: impacted files, breaking changes, DB migration, risks + mitigations, TDD tests to write.
4. **Validate** by risk:
   - Low (1 file, < 1h): proceed.
   - Medium (2-5 files, migration, < 4h): get user validation.
   - High (> 5 files, breaking changes, architecture): detailed plan + mandatory validation.

Then implement with TDD (rule 07). Never code without reading the existing code, its dependencies and its tests.

Details and templates: `${CLAUDE_PLUGIN_ROOT}/references/base/workflow-analysis.md`
