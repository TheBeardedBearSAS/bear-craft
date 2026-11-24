/**
 * Detects the .bmad/sprint-status.yaml shapes written by Bear Craft 10.1.1 (#307), for doctor and update.
 * @module cli/lib/sprint-status-check
 */

import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';
import { listDirs } from './fs-utils.js';
import { legacyShapeWarnings } from '../kanban/shared/sprint-status-shapes.js';

/**
 * @param {string} targetPath project root
 * @returns {string[]} one warning (with its fix) per 10.1.1 shape found; none when the file is absent or unreadable
 */
export function sprintStatusShapeWarnings(targetPath) {
  let data;
  try {
    data = yaml.load(fs.readFileSync(path.join(targetPath, '.bmad', 'sprint-status.yaml'), 'utf8'));
  } catch {
    return [];
  }
  const sprintsDir = path.join(targetPath, 'project-management', 'sprints');
  return legacyShapeWarnings(data, fs.existsSync(sprintsDir) ? listDirs(sprintsDir) : []).map(
    (w) => `.bmad/sprint-status.yaml: ${w}`
  );
}
