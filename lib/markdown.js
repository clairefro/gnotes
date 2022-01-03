const marked = require("marked");

const markdown = (text) => {
  return marked.parse(text);
};

module.exports = markdown;
