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

const sortKeysByVal = (oneLayerObj) => {
  const sortedObj = {};
  const sortedArr = Object.entries(oneLayerObj).sort((a, b) => b[1] - a[1]);
  sortedArr.forEach(([k, v]) => (sortedObj[k] = v));
  return sortedObj;
};

const getAuthorsMap = (notes) => {
  const authorsMap = new Map();
  for (let i in notes) {
    const author = notes[i].fm.author;
    if (author) {
      authorsMap.set(
        author,
        authorsMap.get(author) ? authorsMap.get(author) + 1 : 1
      );
    }
  }
  const authorCounts = {};
  [...authorsMap.entries()].forEach(([k, v]) => (authorCounts[k] = v));

  return sortKeysByVal(authorCounts);
};

const getTagsMap = (notes) => {
  const tagsMap = new Map();
  for (let i in notes) {
    const tags = notes[i].fm.tags;
    if (tags && tags.length) {
      for (let k in tags) {
        const tag = tags[k];
        tagsMap.set(tag, tagsMap.get(tag) ? tagsMap.get(tag) + 1 : 1);
      }
    }
  }
  const tagCounts = {};
  [...tagsMap.entries()].forEach(([k, v]) => (tagCounts[k] = v));

  return sortKeysByVal(tagCounts);
};

const getNotesInfo = (notes) => {
  const repoUrl = getRepoUrl();
  const notesCount = notes.length;
  const authors = getAuthorsMap(notes);
  const yearPublished = getYearPublishedRangeInfo(notes);
  const tags = getTagsMap(notes);

  return {
    repoUrl,
    summary: {
      notes: {
        count: notesCount,
      },
      authors: {
        count: Object.keys(authors).length,
        map: authors,
      },
      tags: {
        count: Object.keys(tags).length,
        map: tags,
      },
      yearPublished,
    },
  };
};

module.exports = { getNotesInfo };
