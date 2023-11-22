const fs = require('fs');
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const MVCS = {
    defaultController: {
        path: './controller/defaultController.js',
        data: '',
        replace_data: ''
    },
    defaultSchema: {
        path: './db/schema/defaultSchema.js',
        data: '',
        replace_data: ''
    },
    defaultRoute: {
        path: './routes/defaultRoute.js',
        data: '',
        replace_data: ''
    },
}

function readDefaultMVC() {
    MVCS.defaultController.data = fs.readFileSync(MVCS.defaultController.path, 'utf8');
    MVCS.defaultSchema.data = fs.readFileSync(MVCS.defaultSchema.path, 'utf8');
    MVCS.defaultRoute.data = fs.readFileSync(MVCS.defaultRoute.path, 'utf8');
}

function replaceMVC(schema_name){
    MVCS.defaultController.replace_data = MVCS.defaultController.data
        .replace(/schemaname/gi, schema_name)
        .replace(schema_name, function(word){
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .replace(schema_name + '.find({});', function(word){
            return word.charAt(0).toUpperCase() + word.slice(1);
        });

    MVCS.defaultController.path = MVCS.defaultController.path
        .replace(/default/gi, schema_name)

    MVCS.defaultSchema.replace_data = MVCS.defaultSchema.data
        .replace(/schemaname/gi, schema_name)
        .replace(schema_name, ((ctr = 0) => match =>
            (++ctr === 4 ? match.charAt(0).toUpperCase() + match.slice(1) : match))());
    MVCS.defaultSchema.path = MVCS.defaultSchema.path
        .replace(/defaultSchema/gi, schema_name)

    MVCS.defaultRoute.replace_data = MVCS.defaultRoute.data
        .replace(/schemaname/gi, schema_name)
    MVCS.defaultRoute.path = MVCS.defaultRoute.path
        .replace(/default/gi, schema_name)
}

function writeMcs() {
    for(const mvc of Object.values(MVCS)){
        fs.writeFile(mvc.path, mvc.replace_data, function (err) {
            if (err) throw err;
        });
    }
}

function main(schema_name){
    readDefaultMVC();
    replaceMVC(schema_name);
    writeMcs();
}

const schema_name = process.argv[2].toString();

console.log(schema_name + " is right? (y / n) : ");
let choice = '';
rl.on("line", (line) => {
    choice = line;
    rl.close();
});
rl.on('close', () => {
    if(choice === 'y') main(schema_name);
})