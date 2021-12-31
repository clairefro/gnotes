const fs = require("fs");
const path = require("path");
const { config } = require("process");

const DEFAULT_BRANCH = "main";

const getRepoFromConfig = (_config) => {
  if (!!_config.repo) {
    const validRe = /^\S+\/\S+$/;
    if (!validRe.test(_config.repo)) {
      throw new Error(
        `Invalid repo format used in gnotes-config.js. Must match format <owner>/<repoName> (ex: 'octocat/mynotes'). Incorrect format detected: ${config.repo}`
      );
    }
    return _config.repo;
  }
  return null;
};

const getGitConfig = () => {
  try {
    return fs.readFileSync(path.resolve(".git", "config"), "utf-8");
  } catch (e) {
    return null;
  }
};

const getRepoFromGitRemote = () => {
  const gitConfig = getGitConfig();

  if (!gitConfig) {
    throw new Error(
      "No git config found. Initialize git with `git init` and add a remote origin to this repo with `git remote add origin <your remote url>`"
    );
  }
  // find remote origin
  const configLines = gitConfig.split("\n");
  const remoteOriginIndex = configLines.findIndex((i) =>
    /\[remote "origin"\]/.test(i)
  );
  if (remoteOriginIndex < 0) {
    throw new Error(
      "No remote origin found. Add a remote origin to this repo with `git remote add origin <your remote url>"
    );
  }
  const originUrlLine = configLines[remoteOriginIndex + 1];
  if (!originUrlLine.match(/url\s?=/)) {
    throw new Error(`Unable to parse git remote origin url: ${originUrlLine}`);
  }
  // Capture repo owner and repo name from the remote url
  const matches = originUrlLine.match(/[:\/](\S+\/\S+)\.git$/);
  if (!matches) {
    throw new Error(
      `Unable to parse repo syntax detected in git remote origin: '${originUrlLine}'`
    );
  }
  return matches[1];
};
/** Returns { username, repoName }. Throws error if no config or git remote found */
const getRepo = () => {
  // Check for config overrides first
  const details = getRepoFromConfig(config);
  return details ? details : getRepoFromGitRemote();
};

const getRepoUrl = () => {
  const repo = getRepo();
  return `https://github.com/${repo}`;
};

const RAW_BASE_URL = "https://raw.githubusercontent.com";

const getRawUrl = (relPath) => {
  const repo = getRepo();
  const branch = config.branch || DEFAULT_BRANCH;
  return `${RAW_BASE_URL}/${repo}/${branch}/${relPath}`;
};

const getPrettyUrl = (relPath) => {
  const repo = getRepo();
  const branch = config.branch || DEFAULT_BRANCH;
  return `https://github.com/${repo}/blob/${branch}/${relPath}`;
};

module.exports = { getRepo, getRepoUrl, getRawUrl, getPrettyUrl };
