// Static linter for the headless (`claude -p`) guidance of workflow commands.
// A fake `claude` cannot execute a command's logic, so the guarantee is static:
// these pure functions parse the markdown by block/sentence (not a bare toContain).

export const TOOLS = ['ScheduleWakeup', 'AskUserQuestion'];

const HEADLESS_LEAD = /^>\s*\*\*(Headless|Mode headless|Modo headless|Headless-Modus)\b/i;
const NEGATION = /\b(do not|don't|never|ne pas|jamais|no|nunca|nicht|weder|nie|não|nem)\b/i;
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

const stripLead = (block) => block.replace(/^\*\*[^*]+\*\*\s*/, '');
// A clause ends at a sentence stop or a coordinating conjunction, so a prohibition never covers a later positive clause.
const CONJ = /\s+\b(?:et|and|then|puis|but|mais|und|aber|y|pero|luego|e|mas)\b\s+/i;
const sentences = (text) => text.split(/(?<=[.;])\s+/).flatMap((s) => s.split(CONJ));

/** Tool mentions in `text` whose sentence has no prohibition marker before them. */
export function positiveToolMentions(text, tools = TOOLS) {
  const bad = [];
  for (const s of sentences(text)) {
    for (const tool of tools) {
      const i = s.indexOf(tool);
      if (i !== -1 && !NEGATION.test(s.slice(0, i))) bad.push({ tool, sentence: s.trim() });
    }
  }
  return bad;
}

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
  for (const m of positiveToolMentions(body)) {
    problems.push(`${name}: ${m.tool} mentioned outside a prohibition: "${m.sentence}"`);
  }
  // ScheduleWakeup must never appear anywhere else in the command either.
  const outside = md
    .split('\n')
    .filter((l) => !HEADLESS_LEAD.test(l) && !/^>\s*\S/.test(l) && l.includes('ScheduleWakeup'));
  if (outside.length) problems.push(`${name}: ScheduleWakeup mentioned outside the headless block`);
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
