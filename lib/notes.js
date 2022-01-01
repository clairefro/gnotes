const fs = require("fs");
const matter = require("gray-matter");
const { getMarkdownFilesSync } = require("./files");
const { getRepoUrl, getRepo } = require("./github");
const { getPrettyUrl, getRawUrl } = require("../lib/github");

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

const getTypesMap = (notes) => {
  const typesMap = new Map();
  for (let i in notes) {
    const type = notes[i].fm.type;
    if (type) {
      typesMap.set(type, typesMap.get(type) ? typesMap.get(type) + 1 : 1);
    }
  }
  const typeCount = {};
  [...typesMap.entries()].forEach(([k, v]) => (typeCount[k] = v));

  return sortKeysByVal(typeCount);
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

/** Takes a notes array and returns a summary of the ontent */
const getNotesInfo = (notes) => {
  const repoUrl = getRepoUrl();
  const notesCount = notes.length;
  const authors = getAuthorsMap(notes);
  const types = getTypesMap(notes);
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
      types: {
        count: Object.keys(types).length,
        map: types,
      },
      tags: {
        count: Object.keys(tags).length,
        map: tags,
      },
      yearPublished,
    },
  };
};

/** Get all markdown notes in a dir and return and array of their metadata */
const getNotes = (appDir, notesDir) => {
  const mdFilepaths = getMarkdownFilesSync(notesDir);

  const notes = mdFilepaths.map((filepath) => {
    const raw = fs.readFileSync(filepath, "utf-8");
    const parsed = matter(raw);
    // 'data' is frontmatter. Only need frontmatter for homepage
    let { data: fm /*, content */ } = parsed;

    const relPath = filepath.replace(new RegExp(`^${appDir}/`), "");
    const prettyUrl = getPrettyUrl(relPath);
    const rawUrl = getRawUrl(relPath);
    const id = [getRepo(), relPath].join("/");
    return { id, fm, prettyUrl, rawUrl, relPath };
  });
  return notes;
};

module.exports = { getNotesInfo, getNotes };
