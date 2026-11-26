#!/usr/bin/env bash
# SubagentStart (matcher Plan) : le sous-agent Plan ne charge pas .claude/rules/ (mesuré le
# 2026-11-26, RFC-002), alors que general-purpose et les agents personnalisés le font. Plan
# décide du périmètre d'un changement : on lui transmet la règle 24 (minimal-change).
set -u
# shellcheck source=lib/hook-io.sh
. "$(dirname "${BASH_SOURCE[0]}")/lib/hook-io.sh"

hook_has_parser || exit 0
hook_input
[[ "$(hook_get agent_type)" == "Plan" ]] || exit 0

root=${CLAUDE_PROJECT_DIR:-$(hook_get cwd)}
rule="$root/.claude/rules/24-minimal-change.md"
[[ -f "$rule" ]] || exit 0

hook_context SubagentStart "$(head -c 6000 "$rule")"
exit 0
