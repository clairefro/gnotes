const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const pug = require("./lib/pug");
const {
  getMarkdownFilesSync,
  clearDirSync,
  mkdirIfNotExistsSync,
} = require("./lib/files");
const { getPrettyUrl, getRawUrl } = require("./lib/github");

const notesDir = path.resolve(__dirname, "notes");
const distDir = path.resolve(__dirname, "docs");
const apiDir = path.join(distDir, "api");

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

    return { fm, prettyUrl, rawUrl, relPath };
  });
  return notes;
};

const notes = getNotes(notesDir);
console.log({ notes: notes[0].fm });

/** Build Wepbages */
const homepageHtml = pug.renderFile(
  path.resolve(__dirname, "templates", "home.pug"),
  { notes }
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

/** Build API */
mkdirIfNotExistsSync(apiDir);

fs.writeFileSync(path.resolve(apiDir, "notes.json"), JSON.stringify(notes));
