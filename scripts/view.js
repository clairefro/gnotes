const { exec } = require("child_process");
const config = require("../gnotes-config");

const { distDir } = config;

if (!distDir) {
  console.error(
    "Error: No distDir specified in gnotes-config.js. Ensure a value is specified for `distDir` (the destination for your bundled files)"
  );
  process.exit(1);
}
exec(`watch-http-config `, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
