// Static linter for the headless (`claude -p`) guidance of workflow commands.
// A fake `claude` cannot execute a command's logic, so the guarantee is static:
// these pure functions parse the markdown by block/sentence (not a bare toContain).

export const TOOLS = ['ScheduleWakeup', 'AskUserQuestion'];

const HEADLESS_LEAD = /^>\s*\*\*(Headless|Mode headless|Modo headless|Headless-Modus)\b/i;
export const NOT_RUN = /NOT RUN|NON EXÉCUTÉE?|NO EJECUTAD[AO]|NICHT AUSGEFÜHRT|NÃO EXECUTAD[AO]/i;
const LITERAL =
  /^(\/bear-[\w-]+:[\w-]+(?: [\w:=-]+)*|project-management\/[\w./-]+|claude -p|ScheduleWakeup|AskUserQuestion)$/;

/** Headless blockquote paragraphs: a lead line `> **Headless ...**` plus its `>` continuation lines. */
export function extractHeadlessBlocks(md) {
  const blocks = [];
  let cur = null;
  for (const line of md.split('\n')) {
    if (HEADLESS_LEAD.test(line)) {
      cur = [line];
      blocks.push(cur);
    } else if (cur && /^>\s*\S/.test(line)) cur.push(line);
    else cur = null;
  }
  return blocks.map((b) => b.map((l) => l.replace(/^>\s?/, '')).join(' '));
}

function stripHeadlessBlocks(md) {
  const kept = [];
  let inBlock = false;
  for (const line of md.split('\n')) {
    if (HEADLESS_LEAD.test(line)) inBlock = true;
    else if (!(inBlock && /^>\s*\S/.test(line))) inBlock = false;
    if (!inBlock) kept.push(line);
  }
  return kept.join('\n');
}

const stripLead = (block) => block.replace(/^\*\*[^*]+\*\*\s*/, '');
// --- Prohibition scanner -------------------------------------------------------------------------
// Left-to-right state machine. A closed list of prohibition formulas (negator glued to an action
// verb, per language) turns "prohibited" on; it covers every tool of the enumeration that follows
// ("do not call A, B or C", "No llamar a A y B", "weder A noch B aufrufen"). It is cleared by a
// sentence stop, by a comma that does not continue a list, and by a later positive call verb.
// German/English postposed formulas ("A und B nicht aufrufen", "A must never be called") clear
// the tools collected since the last stop. A bare "no"/"nicht" never counts as a prohibition.
const W = (re) => `(?<![\\p{L}\\p{N}_])(?:${re})(?![\\p{L}\\p{N}_])`;
const CALL =
  'call\\p{L}*|invok\\p{L}*|us(?:e|es|ed|ing)|run|launch\\p{L}*|appel\\p{L}+|utilis\\p{L}+|lanc\\p{L}+|llam\\p{L}+|invoc\\p{L}+|us(?:ar|a|e|es)|ejecut\\p{L}+|cham\\p{L}+|execut\\p{L}+|aufruf\\p{L}*|aufgerufen|verwend\\p{L}+|benutz\\p{L}+|nutz\\p{L}+|ausführ\\p{L}*|start\\p{L}*';
const ACT = `${CALL}|enter|entr\\p{L}+|activat\\p{L}*|activ\\p{L}+|ativ\\p{L}+|aktivier\\p{L}*|wechsel\\p{L}*|wait\\p{L}*|attend\\p{L}*|esper\\p{L}+|aguard\\p{L}+|wart\\p{L}*`;
const NEG =
  "do not|don['’]t|never|must not|must never|should not|shall not|ne pas|ne jamais|jamais|no|nunca|jamás|sin|não|sem";
const NEG_DE = 'nicht|niemals|nie|keinesfalls';
const TOKENS = new RegExp(
  [
    `(?<cont>${W('ni|nor|nem|noch|oder|or')}\\s+(?:${W(ACT)}))`,
    `(?<post>${W(NEG_DE)}\\s+(?:aufgerufen|aufrufen|verwendet|verwenden)|${W('must|should|shall')}\\s+${W('never|not')}\\s+be\\s+${W('called|used|invoked')})`,
    `(?<prohib>${W(NEG)}\\s+(?:y\\s+|it\\s+)?${W(ACT)}|${W('weder')}|n['’]\\p{L}+\\s+pas(?![\\p{L}]))`,
    // German verb-final: the prohibition only covers what it swallows (a later "und ... aufrufen" is positive).
    `(?<local>${W(NEG_DE)}\\s+(?:[^\\s,.;:]+\\s+){0,4}?${W(ACT)})`,
    `(?<verb>${W(CALL)})`,
    '(?<tool>ScheduleWakeup|AskUserQuestion)',
    '(?<stop>[.;:!?](?=\\s|$)|\\n)',
    '(?<comma>,(?!\\s*(?:`|(?:ni|nor|or|and|et|ou|y|o|u|und|oder|noch|nem|e)(?![\\p{L}]))))',
  ].join('|'),
  'giu'
);

/** Tool mentions in `text` that are not covered by a prohibition formula. */
export function positiveToolMentions(text, tools = TOOLS) {
  const bad = [];
  let prohibited = false;
  let pending = [];
  const flush = () => {
    bad.push(...pending);
    pending = [];
  };
  for (const m of text.matchAll(TOKENS)) {
    const g = m.groups;
    if (g.prohib) prohibited = true;
    else if (g.local) prohibited = false;
    else if (g.post) pending = [];
    else if (g.tool) {
      if (tools.includes(m[0]) && !prohibited) pending.push({ tool: m[0], sentence: sentenceAround(text, m.index) });
    } else if (g.stop || g.comma) {
      flush();
      prohibited = false;
    } else if (g.verb) {
      flush();
      prohibited = false;
    }
  }
  flush();
  return bad;
}

const sentenceAround = (text, i) => {
  const start = Math.max(text.lastIndexOf('. ', i), text.lastIndexOf('\n', i)) + 1;
  const end = text.indexOf('. ', i);
  return text.slice(start, end === -1 ? undefined : end + 1).trim();
};

/** Problems with the headless guidance of a design/implement command ([] when sound). */
export function lintHeadlessCommand(md, { name }) {
  const problems = [];
  const blocks = extractHeadlessBlocks(md);
  if (blocks.length !== 1) return [`${name}: expected exactly 1 headless block, found ${blocks.length}`];
  const body = stripLead(blocks[0]);
  if (!blocks[0].includes('`claude -p`')) problems.push(`${name}: headless block does not mention \`claude -p\``);
  for (const t of TOOLS) {
    if (!body.includes(t)) problems.push(`${name}: headless block does not forbid ${t}`);
  }
  // Whole command, not only the block: a positive call anywhere is a failure.
  for (const m of positiveToolMentions(md)) {
    problems.push(`${name}: ${m.tool} mentioned outside a prohibition: "${m.sentence}"`);
  }
  // ScheduleWakeup has no business outside the headless block (other blockquotes are not tolerated).
  if (stripHeadlessBlocks(md).includes('ScheduleWakeup')) {
    problems.push(`${name}: ScheduleWakeup mentioned outside the headless block`);
  }
  if (name === 'design' && !body.includes('project-management/design-plan.md')) {
    problems.push('design: headless block does not write project-management/design-plan.md');
  }
  return problems;
}

const gateLine = (md, gate) => md.split('\n').find((l) => l.includes(`\`${gate}\``) && NOT_RUN.test(l));

/** The paragraph (line) that invokes `gate`; it must also carry the NOT RUN fallback. */
export function lintGateParagraph(md, gate, { name }) {
  return gateLine(md, gate) ? [] : [`${name}: no paragraph invokes \`${gate}\` together with a NOT RUN fallback`];
}

/** Literal tokens (commands, paths, tool names) quoted in backticks, for cross-language comparison. */
export function literalTokens(text) {
  return [...new Set([...text.matchAll(/`([^`]+)`/g)].map((m) => m[1]).filter((t) => LITERAL.test(t)))].sort();
}

export function headlessTokens(md) {
  return literalTokens(extractHeadlessBlocks(md).join('\n'));
}

export function gateTokens(md, gate) {
  return literalTokens(gateLine(md, gate) ?? '');
}
