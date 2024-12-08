import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pckg = require('./package.json');

/** @type {Partial<import("typedoc").TypeDocOptions>} */
export default {
  entryPoints: ['src/index.ts'],
  out: 'docs',
  excludeInternal: false,
  excludePrivate: false,
  excludeProtected: false,
  name: `Documentation for ${pckg.name} v${pckg.version}`,
  categorizeByGroup: false,
  defaultCategory: pckg.name,
  categoryOrder: [pckg.name, 'Defaults', 'Exceptions', 'Common Types', 'Utilities'],
  gitRevision: pckg.version,
  plugin: [
    'typedoc-plugin-dt-links',
    // 'typedoc-plugin-markdown',
    'typedoc-plugin-mdn-links',
    'typedoc-plugin-merge-modules',
  ],
  validation: {
    invalidLink: true,
  },
};
