const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const marked = require("marked");

const gnotesDir = path.resolve(__dirname, "gnotes");

const testRaw = fs.readFileSync(path.resolve(gnotesDir, "test.md"), "utf-8");
const test = matter(testRaw);

console.log({ gnotesDir });
console.log();
console.log(marked.parse(test.content));
// get all md files in 'gnotes'
// get 'top.md' (currently read, etc)

// ## build homepage
// Build TOC

// ## build gnotes pages
// for each, get fm and content
// template page, output
