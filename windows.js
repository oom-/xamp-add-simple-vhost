
var inquirer = require('inquirer');
var path = require("path");
const fs = require("fs");

let DEFAULT = {
    HOST_FILE: "C:\\Windows\\System32\\drivers\\etc\\hosts",
    WEBSITE_FOLDER: "C:\\xampp\\htdocs\\websites",
    VHOST_FILE: "C:\\xampp\\apache\\conf\\extra\\httpd-vhosts.conf",
    BASIC_ENTRY: "<VirtualHost *>\n\
DocumentRoot \"@WEBSITE_FOLDER@\"\n\
ServerName @SERVER_NAME@\n\
<Directory \"@WEBSITE_FOLDER@>\"\n\
Order allow,deny\n\
Allow from all\n\
Require all granted\n\
</Directory>\n\
</VirtualHost>"
};

(async () => {
    var questions = [
        {
            type: 'input',
            name: 'hosts',
            message: "What is your hosts file location?",
            default: DEFAULT.HOST_FILE
        },
        {
            type: 'input',
            name: 'vhosts',
            message: "What is the vhosts file location?",
            default: DEFAULT.VHOST_FILE
        },
        {
            type: 'input',
            name: 'websiteroot',
            message: "Where is the website root directory?",
            default: DEFAULT.WEBSITE_FOLDER,
        },
    ];
    let answears = await inquirer.prompt(questions);

    let answears2 = await inquirer.prompt([{
        type: 'input',
        name: 'domain',
        default: path.basename(answears.websiteroot) + ".local",
        message: "Which domain name you wish? (domain.local)",
    },])
    DEFAULT.BASIC_ENTRY = DEFAULT.BASIC_ENTRY
        .replace("@WEBSITE_FOLDER@", answears.websiteroot)
        .replace("@WEBSITE_FOLDER@", answears.websiteroot)
        .replace("@SERVER_NAME@", answears.domain);
    let answears3 = await inquirer.prompt({
        type: 'input',
        name: 'entry',
        message: "Which entry do you want in vhost file?",
        default: DEFAULT.BASIC_ENTRY
    });
    answears = { ...answears, ...answears2, ...answears3 };
    console.log("Creating entry in hosts file...");
    if (fs.existsSync(answears.hosts)) {
        try {
            fs.appendFileSync(answears.hosts, `127.0.0.1\t${answears.domain}`);
            console.log("OK");
        }
        catch (ex) {
            console.error(ex)
            process.exit();
        }
    }
    else {
        console.log(`Cannot access: "${answears.hosts}"`);
        process.exit();
    }

    console.log("Creating entry in vhosts file...");
    if (fs.existsSync(answears.vhosts)) {
        try {
            fs.appendFileSync(answears.vhosts, answears.entry);
            console.log("OK");
        }
        catch (ex) {
            console.error(ex)
            process.exit();
        }
    }
    else {
        console.log(`Cannot access: "${answears.vhost}"`);
        process.exit();
    }
    console.log("Done, please restart Apache");
})();