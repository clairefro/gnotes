const fs = require("fs");
const path = require("path");

const getFilesSync = (dir, files) => {
  files = files || [];
  const content = fs.readdirSync(dir);
  for (let i in content) {
    var name = path.join(dir, content[i]);
    if (fs.statSync(name).isDirectory()) {
      getFilesSync(name, files);
    } else {
      files.push(name);
    }
  }
  return files;
};

const getFilesRecByExtSync = (dir, ext = ".*") => {
  const files = getFilesSync(dir);
  const re = new RegExp(`${ext}$`);
  return files.filter((f) => re.test(f));
};

const getMarkdownFilesSync = (dir) => {
  return getFilesRecByExtSync(dir, "(.md)|(.markdown)");
};

module.exports = { getFilesSync, getFilesRecByExtSync, getMarkdownFilesSync };
