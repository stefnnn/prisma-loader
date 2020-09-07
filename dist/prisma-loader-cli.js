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
const yargs_1 = __importDefault(require("yargs"));
const _1 = require("./");
run();
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const argv = cliOptions();
            const logger = argv.quiet ? () => { } : console.log;
            for (let i = 0; i < argv._.length; ++i) {
                const fixtureFile = String(argv._[i]);
                _1.loadFixture(fixtureFile, logger);
            }
            process.exit();
        }
        catch (err) {
            console.error("There was an error loading your data", err.message);
            process.exit(1);
        }
    });
}
function cliOptions() {
    return yargs_1.default
        .usage("npx prisma-loader data.yml    Load data from YAML-file into Prisma schema")
        .options("quiet", {
        alias: "q",
        description: "Suppress output",
        type: "boolean",
    })
        .demandCommand(1)
        .alias("help", "h").argv;
}
//# sourceMappingURL=prisma-loader-cli.js.map