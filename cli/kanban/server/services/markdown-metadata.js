import { mapBmadPriority } from '../../shared/priority.js';
import { parseDependencyRefs } from '../../shared/deps.js';

/**
 * Fallback for backlogs written from the bear-craft templates
 * (Project/i18n/<lang>/templates/{epic,user-story}.md) : no YAML frontmatter,
 * metadata as a "- **Label**: value" bullet list under "## Metadata"
 * (localized heading/labels). Derives the same fields the frontmatter schemas expect.
 */

// One line each, greedy tail trimmed in code: `\s` (which spans newlines) or a lazy tail before `\s*$`
// backtracks quadratically on long blank runs or long lines (a hostile file would hang the refresh).
const H1_RE = /^#[ \t]+((?:US|TT|EPIC)-[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)[ \t]*:(.+)$/m;
// "- **Label**: value" and the French typography "- **Label** : value".
const ITEM_RE = /^[ \t]*[-*][ \t]+\*\*([^*\n]+)\*\*[ \t]*:(.*)$/gm;

// Normalized (lowercase, no accents) label -> field.
const LABELS = {
  id: 'id',
  epic: 'epic_id',
  sprint: 'sprint_id',
  persona: 'persona',
  status: 'status',
  statut: 'status',
  estado: 'status',
  points: 'story_points',
  puntos: 'story_points',
  punkte: 'story_points',
  pontos: 'story_points',
  moscow: 'priority',
  priority: 'priority',
  priorite: 'priority',
  prioridad: 'priority',
  prioritat: 'priority',
  prioridade: 'priority',
  'depends on': 'dependencies',
  'depend de': 'dependencies',
  'depende de': 'dependencies',
  'hangt ab von': 'dependencies',
  // Task template (Project/i18n/<lang>/templates/task.md)
  us: 'us_id',
  type: 'type',
  tipo: 'type',
  typ: 'type',
  estimation: 'estimation',
  estimacion: 'estimation',
  schatzung: 'estimation',
  estimativa: 'estimation',
  'time spent': 'actual',
  'temps passe': 'actual',
  'tiempo gastado': 'actual',
  'aufgewendete zeit': 'actual',
  'tempo gasto': 'actual',
};

// Status values stay English across the 5 template languages ("🔴 To Do").
const STORY_STATUS = {
  'to do': 'backlog',
  todo: 'backlog',
  backlog: 'backlog',
  ready: 'ready-for-dev',
  'ready for dev': 'ready-for-dev',
  'in progress': 'in-progress',
  review: 'review',
  'in review': 'review',
  done: 'done',
  completed: 'done',
  blocked: 'blocked',
};

const TASK_STATUS = {
  'to do': 'to-do',
  todo: 'to-do',
  'in progress': 'in-progress',
  done: 'done',
  completed: 'done',
  blocked: 'blocked',
};

const EPIC_STATUS = {
  'to do': 'draft',
  todo: 'draft',
  draft: 'draft',
  ready: 'ready',
  'in progress': 'in-progress',
  done: 'done',
  completed: 'done',
};

function normalize(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function statusKey(raw) {
  // Drop the leading emoji / punctuation, unify "In-Progress" / "in_progress".
  return normalize(raw)
    .replace(/[^a-z\s_-]/g, '')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isPlaceholder(value) {
  return value === '' || /^\{.*\}$/.test(value) || /^[—–-]+$/.test(value);
}

const tailIs = (buf, marker) => buf.length >= marker.length && buf.slice(-marker.length).join('') === marker;

/**
 * Removes `<!-- ... -->` comments, including the ones that a removal joins together ("<!<!-- -->-- -->").
 * One linear pass: the regex-until-stable form was quadratic on unclosed or deeply nested markers.
 */
export function stripComments(text) {
  const buf = [];
  let open = -1; // index in buf of the oldest "<!--" not closed yet
  for (const ch of text) {
    buf.push(ch);
    if (open < 0) {
      if (tailIs(buf, '<!--')) open = buf.length - 4;
    } else if (buf.length - 3 >= open + 4 && tailIs(buf, '-->')) {
      buf.length = open;
      open = -1;
    }
  }
  return buf.join('');
}

/** Raw field -> value map from the H1 and the metadata bullets (first occurrence wins). */
function parseMetadataList(body) {
  const text = stripComments(body);
  const raw = {};
  const h1 = text.match(H1_RE);
  if (h1 && h1[2].trim()) {
    raw.id = h1[1];
    raw.title = h1[2].trim();
  }
  for (const [, label, tail] of text.matchAll(ITEM_RE)) {
    const field = LABELS[normalize(label)];
    const value = tail.trim();
    if (!field || isPlaceholder(value)) continue;
    raw[field] ??= value;
  }
  return raw;
}

function points(value) {
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? undefined : n;
}

/** "EPIC-001 — Title", "[EPIC-001](…)" -> "EPIC-001"; anything else is left to the schema. */
function bareEpicId(value) {
  if (value === undefined) return undefined;
  return /^[[(\s]*(EPIC-\d{3,})(?=$|[\s\])—–:,])/.exec(value)?.[1] ?? value;
}

function dropUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

/**
 * @param {string} body - markdown file content (no frontmatter)
 * @returns {object} candidate StoryFrontmatterSchema data ({} when nothing found)
 */
export function deriveStoryData(body) {
  const raw = parseMetadataList(body);
  if (Object.keys(raw).length === 0) return {};
  return dropUndefined({
    id: raw.id,
    title: raw.title,
    epic_id: bareEpicId(raw.epic_id),
    sprint_id: raw.sprint_id,
    persona: raw.persona,
    status: raw.status === undefined ? undefined : (STORY_STATUS[statusKey(raw.status)] ?? 'backlog'),
    story_points: raw.story_points === undefined ? undefined : points(raw.story_points),
    priority: raw.priority === undefined ? undefined : mapBmadPriority(raw.priority),
    dependencies: parseDependencyRefs((raw.dependencies ?? '').split(',')),
  });
}

/** "[OPS]" -> "OPS"; "{TYPE}" placeholders are already dropped. */
const bareType = (value) => value?.replace(/^[[\s`]+|[\]\s`]+$/g, '').toUpperCase();

/** "2.5h" -> 2.5 */
const hours = (value) => {
  const n = Number.parseFloat(value ?? '');
  return Number.isNaN(n) ? undefined : n;
};

/**
 * @param {string} body - markdown file content (no frontmatter)
 * @returns {object} candidate TaskFrontmatterSchema data ({} when nothing found)
 */
export function deriveTaskData(body) {
  const raw = parseMetadataList(body);
  if (Object.keys(raw).length === 0) return {};
  // The template's status line ("tracked in .bmad/sprint-status.yaml") is not a status: schema default applies.
  const status = raw.status === undefined ? undefined : TASK_STATUS[statusKey(raw.status)];
  return dropUndefined({
    id: raw.id,
    us_id: raw.us_id,
    type: bareType(raw.type),
    status,
    estimation_hours: hours(raw.estimation),
    actual_hours: hours(raw.actual),
  });
}

/**
 * @param {string} body - markdown file content (no frontmatter)
 * @returns {object} candidate EpicFrontmatterSchema data ({} when nothing found)
 */
export function deriveEpicData(body) {
  const raw = parseMetadataList(body);
  if (Object.keys(raw).length === 0) return {};
  return dropUndefined({
    id: raw.id,
    title: raw.title,
    status: raw.status === undefined ? undefined : (EPIC_STATUS[statusKey(raw.status)] ?? 'draft'),
  });
}
