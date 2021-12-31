const { getRepoUrl } = require("./github");

const getUniqueAuthors = (notes) => {
  const authors = new Set();
  for (let i in notes) {
    authors.add(notes[i].fm.author);
  }
  return [...authors];
};

const getYearPublishedRangeInfo = (notes) => {
  const validYears = [];
  let diff = 0;
  for (let i in notes) {
    const yp = notes[i].fm.yearPublished;
    if (!!yp && !isNaN(yp)) {
      validYears.push(yp);
    }
  }
  const sorted = validYears.sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  if (sorted.length > 2) {
    diff = max - min;
  }
  return { min, max, diff };
};

const getTagCounts = (notes) => {
  const tagMap = new Map();
  for (let i in notes) {
    const tags = notes[i].fm.tags;
    if (tags && tags.length) {
      for (let k in tags) {
        const tag = tags[k];
        tagMap.set(tag, tagMap.get(tag) ? tagMap.get(tag) + 1 : 1);
      }
    }
  }
  const tagCounts = {};
  [...tagMap.entries()].forEach(([k, v]) => (tagCounts[k] = v));
  // sort by most frequently used
  const tagCountsSorted = {};
  const sortedArr = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  sortedArr.forEach(([k, v]) => (tagCountsSorted[k] = v));
  return tagCountsSorted;
};

const getNotesInfo = (notes) => {
  const repoUrl = getRepoUrl();
  const notesCount = notes.length;
  const uniqueAuthors = getUniqueAuthors(notes);
  const yearPublished = getYearPublishedRangeInfo(notes);
  const tags = getTagCounts(notes);

  return {
    repoUrl,
    summary: {
      notesCount,
      authors: uniqueAuthors,
      yearPublished,
      tags,
    },
  };
};

module.exports = { getNotesInfo };
