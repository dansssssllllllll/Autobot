const { spawn } = require("child_process");
const path = require('path');

const SCRIPT_FILE = "auto.js";
const SCRIPT_PATH = path.join(__dirname, SCRIPT_FILE);

let restartCount = 0;
const maxRestarts = 10;

function start() {
  const main = spawn("node", [SCRIPT_PATH], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  main.on("close", (exitCode) => {
    if (exitCode === 0) {
      console.log("Main process exited with code 0");
    } else if (restartCount < maxRestarts) {
      restartCount++;
      console.log(`Main process exited with code ${exitCode}. Restarting... (Attempt ${restartCount}/${maxRestarts})`);
      start();
    } else {
      console.error(`Maximum restarts reached. Exiting.`);
      process.exit(1);
    }
  });
}

start();
