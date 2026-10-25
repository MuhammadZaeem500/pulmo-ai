node -e '
const fs = require("fs");
const path = require("path");

function walk(dir, prefix = "") {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach((file, index) => {
    if (["node_modules", ".next", ".git", ".DS_Store", "dist", "build"].includes(file.name)) return;
    const isLast = index === files.length - 1;
    console.log(prefix + (isLast ? "└── " : "├── ") + file.name);
    if (file.isDirectory()) {
      walk(path.join(dir, file.name), prefix + (isLast ? "    " : "│   "));
    }
  });
}
console.log(".");
walk(".");
'