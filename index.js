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

if(fs.statSync(rootPath).isDirectory()) {
  const affectedFiles = walkSync(rootPath);
  console.log(`${affectedFiles.length} files would be affected: \n\t` + affectedFiles.map(f => f.replace(rootPath, ".")).join("\n\t"));

  if (affectedFiles.length > 40) {
    throw new Error("too many files would be affected");
  }

  for (const file of affectedFiles) {
    if (!fs.statSync(file).isDirectory()) {
      processFile(file);
    }
  }

  const affectedDirs = walkSync(rootPath).reverse().filter(f => fs.statSync(f).isDirectory());

  for (const dir of affectedDirs) {
    const dirPart = path.dirname(dir);
    const namePart = path.basename(dir);
    let newNamePart = replacePreserveCase(namePart, renameFrom, renameTo);
    fs.renameSync(dir, path.join(dirPart, newNamePart));
  }
} else {
  processFile(rootPath);
}


function processFile(file) {
  const content = fs.readFileSync(file, "utf8");
  fs.writeFileSync(file, replacePreserveCase(content, renameFrom, renameTo));

  const dirPart = path.dirname(file);
  const namePart = path.basename(file);
  let newNamePart = replacePreserveCase(namePart, renameFrom, renameTo);
  fs.renameSync(file, path.join(dirPart, newNamePart));
}

function replacePreserveCase(str, from, to) {
  return str.replace(new RegExp(from, "ig"), function (match) {
      let casePreservedTo;
      if(match[0].match(/[A-Z]/)) {
        casePreservedTo = to[0].toUpperCase() + to.slice(1);
      } else {
        casePreservedTo = to[0].toLowerCase() + to.slice(1);
      }

      return casePreservedTo ;
    }
  );
}


function walkSync(dir, filelist) {

  var fs = fs || require('fs'),
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  filelist.push(dir);

  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};