const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const md = require("marked");
const pug = require("pug");
const { getMarkdownFilesSync } = require("./util/files");
const { getPrettyUrl } = require("./util/github");

pug.filters.markdown = (text) => md.parse(text);

const notesDir = path.resolve(__dirname, "notes");
const distDir = path.resolve(__dirname, "docs");

const getNotes = (dir) => {
  const mdFilepaths = getMarkdownFilesSync(dir);

  const notes = mdFilepaths.map((filepath) => {
    const raw = fs.readFileSync(filepath, "utf-8");
    const parsed = matter(raw);
    const { data: meta, content } = parsed;
    console.log(meta);

    const relPath = filepath.replace(new RegExp(`^${__dirname}/`), "");
    const something = getPrettyUrl(relPath);
    console.log({ something });

    return { ...parsed, relPath };
  });
  return notes;
};

const notes = getNotes(notesDir);
// console.log({ notes });

// const homepageHtml = pug.renderFile(
//   path.resolve(__dirname, "templates", "homepage.pug"),
//   {
//     content: md.parse(test.content),
//   }
// );

// const notfoundPageHtml = pug.renderFile(
//   path.resolve(__dirname, "templates", "404.pug")
// );

// const filemap = {
//   "index.html": homepageHtml,
//   "404.html": notfoundPageHtml,
// };

// Object.entries(filemap).forEach(([filename, html]) => {
//   fs.writeFileSync(path.resolve(distDir, filename), html);
// });

// get all md files in 'gnotes'
// get 'top.md' (currently read, etc)

// ## build homepage
// Build TOC

// ## build gnotes pages
// for each, get fm and content
// template page, output
