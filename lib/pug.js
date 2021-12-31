const md = require("marked");
const pug = require("pug");

// Add ':markdown' filter for rending markdown in HTML in pug templates
pug.filters.markdown = (text) => md.parse(text);

module.exports = pug;
