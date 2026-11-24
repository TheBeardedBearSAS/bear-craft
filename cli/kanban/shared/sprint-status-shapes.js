// Shapes of .bmad/sprint-status.yaml written by Bear Craft 10.1.1 (#307). Pure: no I/O.

import { CrossCuttingTasksSchema } from './schemas.js';

const SHORT_SPRINT_RE = /^sprint-\d+$/;

/**
 * Warnings (with the fix) for the 10.1.1 shapes: short metadata.sprint_id while the sprint folder is
 * `sprint-<N>-<slug>`, and a cross_cutting_tasks block that is not a TASK-id map (the Kanban ignores it).
 * @param {object|null} data parsed YAML
 * @param {string[]} [sprintDirIds] folder ids under project-management/sprints/
 * @returns {string[]}
 */
export function legacyShapeWarnings(data, sprintDirIds = []) {
  const warnings = [];
  const id = data?.metadata?.sprint_id;
  const folder = SHORT_SPRINT_RE.test(id ?? '') && sprintDirIds.find((d) => d.startsWith(`${id}-`));
  if (folder) {
    warnings.push(
      `metadata.sprint_id "${id}" is the short form written by 10.1.1: set it to the folder id "${folder}"`
    );
  }
  const cct = data?.cross_cutting_tasks;
  if (cct !== undefined && cct !== null && !CrossCuttingTasksSchema.safeParse(cct).success) {
    warnings.push(
      'cross_cutting_tasks is ignored: expected TASK-id -> { title, status: to-do|in-progress|done|blocked } (a story-shaped block with total/completed/list comes from 10.1.1)'
    );
  }
  return warnings;
}
