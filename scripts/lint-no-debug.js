import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const srcDir = path.resolve(import.meta.dirname, "..", "src");
const jsFiles = [];

function collectJsFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      collectJsFiles(fullPath);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".js")) {
      jsFiles.push(fullPath);
    }
  }
}

collectJsFiles(srcDir);

const forbiddenPatterns = [
  { pattern: /console\.log\s*\(/, message: "console.log is not allowed in production source" },
  { pattern: /\bdebugger\b/, message: "debugger statement is not allowed in production source" },
];

const violations = [];

for (const filePath of jsFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  lines.forEach((lineText, index) => {
    for (const rule of forbiddenPatterns) {
      if (rule.pattern.test(lineText)) {
        violations.push(`${filePath}:${index + 1} ${rule.message}`);
      }
    }
  });
}

if (violations.length > 0) {
  console.error("Lint failed:");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}
