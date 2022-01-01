function filterNotes(_notes, _info, _inputFilters) {
  const defaults = {
    tags: [],
    authors: [],
    types: [],
  };
  const _filters = { ...defaults, ..._inputFilters };

  const matches = [];

  _notes.forEach((n) => {
    let hasTag = false;
    let hasAuthor = false;
    let hasType = false;

    if (
      !Array.isArray(_filters.tags) ||
      _filters.tags.some((t) => n.fm.tags.some(t))
    ) {
      hasTag = true;
    }

    if (
      !Array.isArray(_filters.authors) ||
      _filters.authors.some((i) => i === n.fm.author)
    ) {
      hasAuthor = true;
    }

    if (
      !Array.isArray(_filters.types) ||
      _filters.types.some((i) => i === n.fm.type)
    ) {
      hasType = true;
    }

    if (hasTag || hasAuthor || hasType) {
      matches.push(n);
    }
  });
  return matches;
}
