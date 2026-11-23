import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

// #275 : `Read(**/*credentials*)` bloquait l'écriture de docs/ADR/stories dont le
// nom contient « credentials ». Les deny par défaut ne ciblent que des fichiers de secrets.
const template = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'Dev/i18n/base/Common/templates/settings.json.template'), 'utf8')
);
const deny = template.permissions.deny;

describe('settings.json.template — deny par défaut', () => {
  it('ne contient aucun glob générique *credentials*', () => {
    expect(deny.filter((d) => /\*credentials\*/.test(d))).toEqual([]);
  });

  it('cible les fichiers de secrets précis', () => {
    expect(deny).toContain('Read(**/*credentials.json)');
    expect(deny).toContain('Read(**/credentials.tfrc.json)');
    expect(deny).toContain('Read(**/.aws/credentials)');
    expect(deny).toContain('Read(**/.git-credentials)');
    expect(deny).toContain('Read(**/.ssh/**)');
    expect(deny).toContain('Read(**/id_rsa)');
    expect(deny).toContain('Read(**/*.tfstate)');
    expect(deny).toContain('Read(**/.credentials*)');
    expect(deny).toContain('Read(**/*.key)');
    expect(deny).toContain('Read(**/*.pem)');
    expect(deny).toContain('Read(**/.env)');
    expect(deny).toContain('Read(**/.env.*)');
    expect(deny).toContain('Read(**/secrets/**)');
  });
});
