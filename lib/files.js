const fs = require("fs-extra");
const path = require("path");

const mkdirIfNotExistsSync = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

const copySync = (srcDir, destDir, opts) => {
  fs.copySync(srcDir, destDir, opts);
};

const rmDirSync = (dirPath) => {
  try {
    var files = fs.readdirSync(dirPath);
  } catch (e) {
    return;
  }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + "/" + files[i];
      if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
      else rmDirSync(filePath);
    }
  fs.rmdirSync(dirPath);
};

const clearDirSync = (dir) => {
  rmDirSync(dir);
  mkdirIfNotExistsSync(dir);
};

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

module.exports = {
  mkdirIfNotExistsSync,
  copySync,
  rmDirSync,
  clearDirSync,
  getFilesSync,
  getFilesRecByExtSync,
  getMarkdownFilesSync,
};
