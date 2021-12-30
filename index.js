const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const marked = require("marked");
const pug = require("pug");

const gnotesDir = path.resolve(__dirname, "gnotes");
const distDir = path.resolve(__dirname, "docs");

const testRaw = fs.readFileSync(path.resolve(gnotesDir, "notes1.md"), "utf-8");
const test = matter(testRaw);

console.log({ gnotesDir });
console.log();
console.log(marked.parse(test.content));

const homepageHtml = pug.renderFile(
  path.resolve(__dirname, "templates", "homepage.pug"),
  {
    content: marked.parse(test.content),
  }
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

// get all md files in 'gnotes'
// get 'top.md' (currently read, etc)

// ## build homepage
// Build TOC

// ## build gnotes pages
// for each, get fm and content
// template page, output
