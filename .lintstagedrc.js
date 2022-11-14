module.exports = {
  "*.ts": ["npx prettier --write", "npx eslint --fix", "npm t"],
};
