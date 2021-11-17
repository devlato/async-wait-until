// eslint-disable-next-line @typescript-eslint/no-var-requires
const pckg = require('./package.json');

module.exports = {
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
  validation: {
    invalidLink: true,
  },
  gaID: process.env.GA_ID,
  gaSite: process.env.GA_SITE || 'auto',
};
