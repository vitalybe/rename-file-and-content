const fs = require("fs");
const path = require("path");
const process = require("process");

const args = process.argv.slice(2);
const rootPath = args[0];
const renameRequest = args[1];

if(!fs.existsSync(rootPath)) {
  throw new Error("root path doesn't exist: " + rootPath);
}

let match = renameRequest.match(/^(\w+?)\s?->\s?(\w+)$/);
if(!match) {
  throw new Error("must match pattern: name1 -> name2");
}

const renameFrom = match[1];
const renameTo = match[2];

console.log(`Renaming in:\n\t${rootPath}\n\t'${renameFrom}' to '${renameTo}'`);
console.log();

const affectedFiles = walkSync(rootPath);
console.log(`${affectedFiles.length} files would be affected: \n\t` + affectedFiles.map(f => f.replace(rootPath, ".")).join("\n\t"));

function walkSync(dir, filelist) {
  var fs = fs || require('fs'),
    files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
      filelist.push(path.join(dir, file));
    }
    else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};