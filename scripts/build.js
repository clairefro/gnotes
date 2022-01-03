const fs = require("fs");
const path = require("path");
const util = require("util");
const pug = require("../lib/pug");
const markdown = require("../lib/markdown");
const epochify = require("../lib/epochify");
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
const staticDir = path.resolve(appDir, "templates", "static");
const apiDir = path.join(distDir, "api");

clearDirSync(distDir);

const notes = getNotes(appDir, notesDir);
const info = getNotesInfo(notes);

console.log(`Found ${info.summary.notes.count} notes in '${config.notesDir}'`);

/** Build Website */
if (config.makeWebsite) {
  console.log("Building home page...");
  const homepageHtml = pug.renderFile(
    path.resolve(appDir, "templates", "home.pug"),
    { notes, info }
  );

  console.log("Building 404 page...");
  const notfoundPageHtml = pug.renderFile(
    path.resolve(appDir, "templates", "404.pug")
  );

  // // For alternate note page rendering.....
  // const notePageHtml = pug.renderFile(
  //   path.resolve(appDir, "templates", "note.pug")
  // );

  console.log("Building notes dir...");
  mkdirIfNotExistsSync(path.resolve(distDir, "notes"));

  console.log("Building note pages...");
  const notesPages = notes.map((n) => {
    const html = pug.renderFile(path.resolve(appDir, "templates", "note.pug"), {
      note: n,
      markdown,
      epochify,
    });
    return { html, slug: n.slug };
  });

  const filemap = {
    "index.html": homepageHtml,
    "404.html": notfoundPageHtml,
  };

  // add notesPages to fileMap
  notesPages.forEach((np) => {
    const file = `notes/${np.slug}.html`;
    filemap[file] = np.html;
  });

  const builtPages = Object.keys(filemap);
  console.log(
    `Build ${builtPages.length} pages: `,
    util.inspect(builtPages, { maxArrayLength: 10 })
  );

  console.log("Writing web pages to dist dir...");
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
  console.log("Built 2 API endpoints: ", ["api/info.json", "api/notes.json"]);
  console.log("Done.");
} else {
  console.log(
    'Skipping build of API. To enable, set { makeApi: true } in "gnotes-config.js"'
  );
}
