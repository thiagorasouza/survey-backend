module.exports = {
  "*.ts": ["npx prettier --write", "npx eslint --fix", "npm run test:staged"],
};
