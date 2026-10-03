// PostToolUse: format edited source files with prettier.
import { execFileSync } from "node:child_process";

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  const file = JSON.parse(raw).tool_input?.file_path ?? "";
  if (!/\.(tsx?|mts|mjs|json|css|md)$/.test(file) || file.endsWith("schema.d.ts")) return;
  try {
    execFileSync("node", ["node_modules/prettier/bin/prettier.cjs", "--write", file], {
      stdio: "ignore",
    });
  } catch {
    // Formatting is best effort; `npm run check` is the gate.
  }
});
