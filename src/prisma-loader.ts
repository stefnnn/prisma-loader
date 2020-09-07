#!/usr/bin/env node
import { PrismaClient } from "@prisma/client";
import yaml from "js-yaml";
import * as fs from "fs";
import yargs from "yargs";

const prisma = new PrismaClient();
run();

async function run() {
  const argv = cliOptions();
  const fixtureFile = String(argv._.pop());
  const deleteAll = argv.delete ? true : false;
  const data: any = loadFixture(fixtureFile);
  if (data?.delete) {
    await deleteObjects(data.delete);
    delete data.delete;
  }
  await createObjects(data);
  console.log("-----------------------------------------------------------");
  console.log(`Finished loading database with fixture from ${fixtureFile}`);
}

function loadFixture(filename: string) {
  const yamlFile = fs.readFileSync(filename, "utf8");
  const data = yaml.safeLoad(yamlFile);
  return data;
}

async function deleteObjects(list: string[]) {
  console.log("Let's first wipe out existing objects:");
  for (const i in list) {
    const type = list[i];
    // @ts-ignore  what's the type for generic PrismaDelegates?
    const obj: any = prisma[type];
    if (!obj)
      throw new Error(`Type «${type}» does not exist in your prisma schema.`);
    const result = await obj.deleteMany({});
    console.log(`... deleted ${result.count} objects of type «${type}»`);
  }
  console.log("\n");
}

async function createObjects(data: any) {
  console.log("Let's create new objects:");
  for (const type in data) {
    // @ts-ignore  what's the type for generic PrismaDelegates?
    const obj: any = prisma[type];
    if (!obj)
      throw new Error(`Type «${type}» does not exist in your prisma schema.`);
    const list = data[type];

    let count = 0;
    for (const i in list) {
      const spec = list[i];
      const result = await obj.create({ data: spec });
      if (result) count++;
    }
    console.log(
      `... created ${count} objects of type «${type}» in db and uncounted linked types`
    );
  }
  console.log("\n");
}

function cliOptions() {
  return yargs
    .usage(
      "npx prisma-loader data.yml    Load data from YAML-file into Prisma schema"
    )
    .options("delete", {
      alias: "d",
      description: "Delete all existing objects prior to loading data",
      type: "boolean",
    })
    .demandCommand(1)
    .alias("help", "h").argv;
}
