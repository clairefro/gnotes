const path = require("path");
const config = require("../gnotes-config");
const { copySync } = require("../lib/files");

const DEFAULT_NOTE_NAME = `new-note-${new Date().toISOString()}`;

const filename = `${process.argv[2] || DEFAULT_NOTE_NAME}.md`;

const newNoteTemplate = path.resolve(
  __dirname,
  "..",
  "templates",
  "newNote.md"
);
const outputDir = path.resolve(__dirname, "..", filename);

try {
  copySync(newNoteTemplate, outputDir, {
    overwrite: false,
    errorOnExist: true,
  });

  console.log(
    `New note template generated at ${outputDir}.\n\nMove this note anywhere inside "${config.notesDir}/" to make it publishable.\n`
  );
} catch (e) {
  console.log(`Error: ${e.message}. Aborting.`);
}
