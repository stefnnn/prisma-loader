#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs = __importStar(require("fs"));
const yargs_1 = __importDefault(require("yargs"));
const prisma = new client_1.PrismaClient();
run();
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const argv = cliOptions();
            let fixtureFile;
            while ((fixtureFile = String(argv._.shift()))) {
                console.log(`📦 Loading data from ${fixtureFile}`);
                const data = loadFixture(fixtureFile);
                if (data === null || data === void 0 ? void 0 : data.delete) {
                    yield deleteObjects(data.delete);
                    delete data.delete;
                }
                yield createObjects(data);
                console.log("");
            }
            process.exit();
        }
        catch (err) {
            console.error("There was an error loading your data", err.message);
            process.exit(1);
        }
    });
}
function loadFixture(filename) {
    const yamlFile = fs.readFileSync(filename, "utf8");
    const data = js_yaml_1.default.safeLoad(yamlFile);
    return data;
}
function deleteObjects(list) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("💥 Let's first wipe out existing objects:");
        for (const i in list) {
            const type = list[i];
            // @ts-ignore  what's the type for generic PrismaDelegates?
            const obj = prisma[type];
            if (!obj)
                throw new Error(`Type «${type}» does not exist in your prisma schema.`);
            const result = yield obj.deleteMany({});
            console.log(`  ... deleted ${result.count} objects of type «${type}»`);
        }
    });
}
function createObjects(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🐣 Let's create new objects:");
        for (const type in data) {
            // @ts-ignore  what's the type for generic PrismaDelegates?
            const obj = prisma[type];
            if (!obj)
                throw new Error(`Type «${type}» does not exist in your prisma schema.`);
            const list = data[type];
            let count = 0;
            for (const i in list) {
                const spec = list[i];
                const result = yield obj.create({ data: spec });
                if (result)
                    count++;
            }
            console.log(`  ... created ${count} objects of type «${type}» in db and uncounted linked types`);
        }
    });
}
function cliOptions() {
    return yargs_1.default
        .usage("npx prisma-loader data.yml    Load data from YAML-file into Prisma schema")
        .options("delete", {
        alias: "d",
        description: "Delete all existing objects prior to loading data",
        type: "boolean",
    })
        .demandCommand(1)
        .alias("help", "h").argv;
}
//# sourceMappingURL=prisma-loader.js.map