const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const pug = require("./lib/pug");
const {
  getMarkdownFilesSync,
  clearDirSync,
  copySync,
  mkdirIfNotExistsSync,
} = require("./lib/files");
const { getPrettyUrl, getRawUrl, getRepo } = require("./lib/github");
const { getNotesInfo } = require("./lib/api");

const notesDir = path.resolve(__dirname, "notes");
const distDir = path.resolve(__dirname, "docs");
const staticDir = path.resolve(__dirname, "static");
const apiDir = path.join(distDir, "api");

const REPO = getRepo();

clearDirSync(distDir);

const getNotes = (dir) => {
  const mdFilepaths = getMarkdownFilesSync(dir);

  const notes = mdFilepaths.map((filepath) => {
    const raw = fs.readFileSync(filepath, "utf-8");
    const parsed = matter(raw);
    // 'data' is frontmatter. Only need frontmatter for homepage
    let { data: fm /*, content */ } = parsed;

    const relPath = filepath.replace(new RegExp(`^${__dirname}/`), "");
    const prettyUrl = getPrettyUrl(relPath);
    const rawUrl = getRawUrl(relPath);
    const id = [REPO, relPath].join("/");
    return { id, fm, prettyUrl, rawUrl, relPath };
  });
  return notes;
};

const notes = getNotes(notesDir);
const info = getNotesInfo(notes);

/** Build Wepbages */
const homepageHtml = pug.renderFile(
  path.resolve(__dirname, "templates", "home.pug"),
  { notes, info }
);

const notfoundPageHtml = pug.renderFile(
  path.resolve(__dirname, "templates", "404.pug")
);

const filemap = {
  "index.html": homepageHtml,
  "404.html": notfoundPageHtml,
};

Object.entries(filemap).forEach(([filename, html]) => {
  fs.writeFileSync(path.resolve(distDir, filename), html);
});

/** Copy over static  */

copySync(staticDir, distDir);

/** Build API */
mkdirIfNotExistsSync(apiDir);
// Write notes.json
fs.writeFileSync(path.resolve(apiDir, "notes.json"), JSON.stringify(notes));
// Write info.json
fs.writeFileSync(path.resolve(apiDir, "info.json"), JSON.stringify(info));
