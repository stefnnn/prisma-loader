#!/usr/bin/env node
"use strict";
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
exports.loadFixture = void 0;
const client_1 = require("@prisma/client");
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
function loadFixture(fixtureFile, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        logger && logger(`📦 Loading data from ${fixtureFile}`);
        const data = parseYAML(fixtureFile);
        if (typeof data === "undefined") {
            throw new Error(`Could not parse YAML file ${fixtureFile}`);
        }
        if (typeof data !== "object") {
            throw new Error("Please specify YAML file as an object, e.g. no '- xyz' on top-level.");
        }
        if (data.hasOwnProperty("delete")) {
            yield deleteObjects(data.delete, logger);
            delete data.delete;
        }
        yield createObjects(data, logger);
        logger && logger("");
    });
}
exports.loadFixture = loadFixture;
function parseYAML(filename) {
    const contents = fs_1.default.readFileSync(filename, "utf8");
    const data = js_yaml_1.default.safeLoad(contents);
    return data;
}
function deleteObjects(list, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        logger && logger("💥 Let's first wipe out existing objects:");
        for (const i in list) {
            const type = list[i];
            // @ts-ignore  what's the type for generic PrismaDelegates?
            const obj = prisma[type];
            if (!obj) {
                throw new Error(`Type «${type}» does not exist in your prisma schema.`);
            }
            const result = yield obj.deleteMany();
            logger && logger(`  ... deleted ${result.count} objects of type «${type}»`);
        }
    });
}
function createObjects(data, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        logger && logger("🐣 Let's create new objects:");
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
            logger &&
                logger(`  ... created ${count} objects of type «${type}» in db and uncounted linked types`);
        }
    });
}
//# sourceMappingURL=prisma-loader.js.map