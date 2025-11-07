const { isCancel, cancel } = require("@clack/prompts");

function exitOnCancel(value) {
  if (isCancel(value)) {
    console.info("🏃 User exited hurriedly");
    cancel();
    process.exit(0);
  }
}

async function script(main) {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error("🚨 Something went wrong");
    console.error(error);
    process.exit(1);
  }
}

module.exports = { script, exitOnCancel };
