const getRepoName = require("git-repo-name");

const RAW_BASE_URL = "https://raw.githubusercontent.com";

const getRawUrl = (relPath, username) => {};

const getPrettyUrl = (relPath, username) => {
  const repoName = getRepoName.sync();
  console.log({ repoName });
  return `https://github.com/${username}/gnotes/blob/main/${relPath}`;
};

module.exports = { getRawUrl, getPrettyUrl };
