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

module.exports = {
  mkdirIfNotExistsSync,
  copySync,
  rmDirSync,
  clearDirSync,
};
