#!/usr/bin/env node
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import yargs from "yargs";
import { fileURLToPath } from "url";
import inquirer from "inquirer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let filePath;
let files;
let newName;
let count = 0;
let pad = "";

const options = yargs
  .option("i", {
    alias: "input",
    describe: "Path to the folder where you want to rename all files.",
    type: "string",
  })
  .option("n", { alias: "newName", describe: "New name of your files.", type: "string" }).argv;

filePath = options.input || "input";

async function getFiles() {
  if (!fs.existsSync(path.join(__dirname, "input"))) {
    await fsPromises.mkdirSync(path.join(__dirname, "input"));
  }
  files = fs.readdirSync(`${filePath}`);
  console.log(files);
  return files;
}

async function rename() {
  console.log(`renaming all files in ${filePath}`);
  if (!options.newName) {
    const answers = await inquirer.prompt({
      name: "new_name",
      type: "input",
      message: "What would you like to call your files?\n",
    });
    newName = answers.new_name;
  } else {
    newName = options.newName;
  }

  for (let file of files) {
    let ext = path.extname(file);

    count += 1;
    if (files.length >= 100) {
      if (count < 10) {
        pad = "00";
        fs.renameSync(`${filePath}/${file}`, `${filePath}/${newName}${pad}${count}${ext}`);
        console.log(`renaming ${file} to ${newName}${pad}${count}${ext}`);
      } else if (count >= 10 && count < 100) {
        pad = "0";
        fs.renameSync(`${filePath}/${file}`, `${filePath}/${newName}${pad}${count}${ext}`);
        console.log(`renaming ${file} to ${newName}${pad}${count}${ext}`);
      } else {
        fs.renameSync(`${filePath}/${file}`, `${filePath}/${newName}${count}${ext}`);
        console.log(`renaming ${file} to ${newName}${count}${ext}`);
      }
    } else if (files.length >= 10 && !files.length < 100) {
      if (count < 10) {
        pad = "0";
        fs.renameSync(`${filePath}/${file}`, `${filePath}/${newName}${pad}${count}${ext}`);
        console.log(`renaming ${file} to ${newName}${pad}${count}${ext}`);
      } else {
        fs.renameSync(`${filePath}/${file}`, `${filePath}/${newName}${count}${ext}`);
        console.log(`renaming ${file} to ${newName}${count}${ext}`);
      }
    } else {
      fs.renameSync(`${filePath}/${file}`, `${filePath}/${newName}${count}${ext}`);
    }
  }
  count = 0;
  pad = "";
}

await getFiles();
await rename();
