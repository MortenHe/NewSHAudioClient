//node .\deployWebsiteToServer.js pw pw (= PW Webseite auf PW Pi laden)
//node .\deployWebsiteToServer.js marlen vb (= Marlen Webseite auf VB laden)
//node .\deployWebsiteToServer.js vb vb (= VB Webseite auf VB laden)

//Connection laden
const connection = require("./connection.js");

//Welche Website (pw vs. marlen) wohin deployen (pw / marlen / vb)
const appId = process.argv[2] || "pw";
const targetMachine = process.argv[3] || "pw";
console.log("build and deploy audio (" + appId + ") to server " + targetMachine);

//Unter welchem Unterpfad wird die App auf dem Server laufen?
const base_href = "shp";

//Projekt bauen
const { execSync } = require('child_process');
console.log("start build");
execSync("ng build --configuration=" + appId + " --base-href=/" + base_href + "/ --prod");
console.log("build done");

//htaccess Schablone in dist Ordner kopieren und durch Pattern Ersetzung anpassen
const fs = require('fs-extra');
const replace = require("replace");
console.log("copy htacces");
fs.copySync('.htaccess', '../../dist/htaccess');
console.log("update htacces");
replace({
    regex: "###PATH###",
    replacement: base_href,
    paths: ['../../dist/htaccess'],
    recursive: true,
    silent: true
});

//Dist-Folder zippen
const zipFolder = require('zip-folder');
console.log("zip data");
zipFolder('../../dist', '../../myDist.zip', function (err) { });

//Pfad wo Webseiten-Dateien auf Server liegen sollen
let server_audio_path = "/var/www/html/" + base_href;

//SSH-Verbindung um Shell-Befehle auszufuehren (unzip, chmod,...)
const SSH2Promise = require('ssh2-promise');
const ssh = new SSH2Promise({
    host: connection[targetMachine].host,
    username: connection[targetMachine].user,
    password: connection[targetMachine].password
});

//sftp-Verbindung um Webseiten-Dateien hochzuladen
const Client = require('ssh2-sftp-client');
const sftp = new Client();
sftp.connect({
    host: connection[targetMachine].host,
    port: '22',
    username: connection[targetMachine].user,
    password: connection[targetMachine].password
}).then(() => {

    //gibt es schon einen Ordner (shp)
    console.log("check if exists: " + server_audio_path)
    return sftp.exists(server_audio_path);
}).then((dir_exists) => {

    //Wenn Ordner (shp) existiert, diesen rekursiv loeschen
    if (dir_exists) {
        console.log("delete folder " + server_audio_path);
        return sftp.rmdir(server_audio_path, true);
    }
}).then(() => {

    //neuen Ordner (shp) anlegen
    console.log("create folder " + server_audio_path);
    return sftp.mkdir(server_audio_path);
}).then(() => {

    //gezippten Webseiten-Code hochladen
    console.log("upload zip file");
    return sftp.fastPut("../../myDist.zip", server_audio_path + "/myDist.zip");
}).then(() => {

    //per SSH verbinden, damit Shell-Befehle ausgefuehrt werden koennen
    console.log("connect via ssh");
    return ssh.connect();
}).then(() => {

    //Webseiten-Code entzippen
    console.log("unzip file");
    return ssh.exec("cd " + server_audio_path + " && unzip myDist.zip");
}).then(() => {

    //htaccess file umbenennen (htaccess -> .htaccess)
    console.log("rename htaccess file");
    return ssh.exec("mv " + server_audio_path + "/htaccess " + server_audio_path + "/.htaccess")
}).then(() => {

    //Zip-File loeschen
    console.log("delete zip file");
    return sftp.delete(server_audio_path + "/myDist.zip");
}).then((data) => {

    //Rechte anpassen, damit Daten in Webseite geladen werden koennen
    console.log("chmod 0777");
    return ssh.exec("chmod -R 0777 /var/www/html");
}).then(() => {

    //Programm beenden
    console.log("build process done");
    sftp.end();
    process.exit();
}).catch((err) => {
    console.log(err);
});