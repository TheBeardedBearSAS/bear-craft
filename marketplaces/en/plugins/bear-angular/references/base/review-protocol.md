# Review Protocol

Shared by the stack reviewers (`*-reviewer` agents) and code reviews. Additive: each reviewer keeps its own 100-point grid and report format.

1. **Read beyond the diff.** For every changed function, field, route, event or export, use Grep to find its callers and importers, and read them. A rename or a changed return value most often breaks a file the diff does not show.
2. **Check, in this order:** bugs and broken callers; security (rule 11); behaviour under real load (N+1 queries, unbounded loops or lists, missing pagination, timeouts); risky logic without a test (rule 07); slow paths; code that is not needed (rule 24).
3. **Write each finding as:** location (`file:line`) · what the code does · what goes wrong (a concrete input and the wrong result) · the fix · the risk if it is skipped.
4. **Rank:** *Must fix* (wrong result, crash, data loss, security hole) · *Should fix* · *Nice to have*. List *Must fix* first and say "none" when there is none.
5. **Skip** what linters and formatters already enforce.
