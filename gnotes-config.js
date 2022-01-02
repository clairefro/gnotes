const package = require("./package.json");

module.exports = {
  makeWebsite: true, // builds an explorable website to /docs for hosting on GitHub pages
  makeApi: true, // makes metadata about your notes accessible from a JSON API hosted on GitHub pages
  branch: "main", // branch used for deployment. Defaults to "main"
  notesDir: "notes", // dir that holds publishable markdown notes. Defaults to "notes"
  distDir: package.config.distDir || "docs", // distDir is defined in package.json. Deafualts to "docs" for compatibility with GitHub pages
  // repo: "octocat/mynotes",   // Name of repo holding your gnotes, inlcuding owner name. By default, repo of git remote origin is used. Uncomment if you need to override
};
