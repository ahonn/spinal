export default {
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    'semantic-release-yarn',
    '@semantic-release/github',
    '@semantic-release/git',
  ],
};
