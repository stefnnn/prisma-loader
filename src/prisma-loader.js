var client_1 = require("@prisma/client");
var js_yaml_1 = require("js-yaml");
var fs_1 = require("fs");
var yargs_1 = require("yargs");
var fixtureFile = "./basic-db.yml";
var deleteAll = true;
var prisma = new client_1.PrismaClient();
run();
async;
function run() {
    var argv = cliOptions();
    if (argv._.includes("load")) {
        var fixtureFile_1 = argv.filename;
        var deleteAll_1 = argv.delete;
        var data = loadFixture(fixtureFile_1);
        await;
        createObjects(data, { deleteAll: deleteAll_1 });
        console.log("-----------------------------------------------------------");
        console.log("Finished loading database with fixture from " + fixtureFile_1);
    }
}
function loadFixture(filename) {
    var yamlFile = fs_1["default"].readFileSync(filename);
    var data = js_yaml_1["default"].safeLoad(yamlFile);
    return data;
}
async;
function createObjects(data, options) {
    console.log("LOAD CMD", options);
    return;
    for (var type in data) {
        if (!prisma[type])
            throw new Error("Type \u00AB" + type + "\u00BB does not exist in your prisma schema.");
        var obj = prisma[type];
        var list = data[type];
        if (options.deleteAll) {
            var count_1 = await, obj_1, deleteAll_2 = ();
            console.log("Deleted " + count_1 + " of object " + type);
        }
        var count = 0;
        for (var i in list) {
            var spec = list[i];
            var result = await, obj_2, create = (spec);
            if (result)
                count++;
        }
        console.log("Created " + count + " " + type + " in db and uncounted linked types\n");
    }
}
function cliOptions() {
    return yargs_1["default"]
        .command("load", "Load data from YAML-file into Prisma schema", {
        filename: {
            description: "path to YAML file with the datastructure to load",
            type: "string"
        }
    })
        .options("delete", {
        alias: "d",
        description: "Delete all existing objects prior to loading data",
        type: "boolean"
    })
        .help()
        .alias("help", "h").argv;
}
