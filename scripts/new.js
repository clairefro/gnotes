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

const appDir = path.resolve(__dirname, "..");
const notesDir = path.resolve(appDir, config.notesDir);
const outputDir = path.resolve(notesDir, filename);

try {
  copySync(newNoteTemplate, outputDir, {
    overwrite: false,
    errorOnExist: true,
  });
  __dirname, "..";

  console.log(
    `New note template generated at ${outputDir}.\n\You can move this note anywhere inside "${config.notesDir}/".\n`
  );
} catch (e) {
  console.log(`Error: ${e.message}. Aborting.`);
}
