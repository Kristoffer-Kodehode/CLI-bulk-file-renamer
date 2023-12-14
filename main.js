#!/usr/bin/env node
// const fs = require("fs");
// const fsPromises = require("fs").promises;
// const path = require("path");
// const yargs = require("yargs");
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

const options = yargs
  .option("i", {
    alias: "input",
    describe: "Path to the folder where you want to rename all files.",
    type: "string",
  })
  .option("n", { alias: "newName", describe: "New name of your files.", type: "string" }).argv;

async function getPath() {
  filePath = options.input || "./input";
}

async function getFiles() {
  if (!fs.existsSync(path.join(__dirname, "input"))) {
    await fsPromises.mkdirSync(path.join(__dirname, "input"));
  }
  files = fs.readdirSync(`${filePath}`);
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
    //let name = path.basename(file, ext);
    count += 1;

    fs.renameSync(`${filePath}/${file}`, `${filePath}/${newName}${count}${ext}`);
  }
  count = 0;
}

await getPath();
await getFiles();
await rename();
