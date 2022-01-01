const fs = require("fs");
const path = require("path");
const pug = require("../lib/pug");
const {
  clearDirSync,
  copySync,
  mkdirIfNotExistsSync,
} = require("../lib/files");
const { getNotes, getNotesInfo } = require("../lib/notes");
const config = require("../gnotes-config");

/** Point to project root */
const appDir = path.resolve(__dirname, "..");

const notesDir = path.resolve(appDir, config.notesDir || "notes");
const distDir = path.resolve(appDir, config.destDir || "docs");
const staticDir = path.resolve(appDir, "static");
const apiDir = path.join(distDir, "api");

clearDirSync(distDir);

const notes = getNotes(appDir, notesDir);
const info = getNotesInfo(notes);

console.log(`Found ${info.summary.notes.count} notes in '${config.notesDir}'`);

/** Build Website const appDir = dirname(require.main.filename);
console.log({ appDir });*/
if (config.makeWebsite) {
  console.log("Building website...");
  const homepageHtml = pug.renderFile(
    path.resolve(appDir, "templates", "home.pug"),
    { notes, info }
  );

  const notfoundPageHtml = pug.renderFile(
    path.resolve(appDir, "templates", "404.pug")
  );

  const filemap = {
    "index.html": homepageHtml,
    "404.html": notfoundPageHtml,
  };

  Object.entries(filemap).forEach(([filename, html]) => {
    fs.writeFileSync(path.resolve(distDir, filename), html);
  });

  /** Copy over static files */
  copySync(staticDir, distDir);
  console.log("Done.");
} else {
  console.log(
    'Skipping build of Website. To enable, set { makeWebsite: true } in "gnotes-config.js"'
  );
}

/** Build API */
if (config.makeApi) {
  console.log("Building API...");
  mkdirIfNotExistsSync(apiDir);
  // Write notes.json
  fs.writeFileSync(path.resolve(apiDir, "notes.json"), JSON.stringify(notes));
  // Write info.json
  fs.writeFileSync(path.resolve(apiDir, "info.json"), JSON.stringify(info));
  console.log("Done.");
} else {
  console.log(
    'Skipping build of API. To enable, set { makeApi: true } in "gnotes-config.js"'
  );
}
