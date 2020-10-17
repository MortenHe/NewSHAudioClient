//Webseite bauen und auf Server laden
//node .\deployWebsiteToServer.js pw | marlen | vb | laila

//Async Methode fuer Await Aufrufe
async function main() {

    //Connection laden
    const connection = require("./connection.js");

    //Welche Website (pw / marlen / vb) wohin deployen (pw / marlen / vb)
    const targetMachine = process.argv[2] || "pw";
    console.log("build and deploy audio (" + targetMachine + ") to server " + targetMachine + ": " + connection[targetMachine].host);

    //Unter welchem Unterpfad wird die App auf dem Server laufen?
    const base_href = "shp";

    //Pfad wo Webseiten-Dateien auf Server liegen sollen
    let server_audio_path = "/var/www/html/" + base_href;

    //Projekt bauen
    console.log("start build");
    const execSync = require('child_process').execSync;
    execSync("ng build -c=" + targetMachine + " --base-href=/" + base_href + "/", { stdio: 'inherit' });
    console.log("build done");

    //htaccess Schablone in dist Ordner kopieren und durch Pattern Ersetzung anpassen
    const fs = require('fs-extra');
    const replace = require("replace");
    console.log("copy htacces");
    await fs.copy('.htaccess', '../../dist/htaccess');

    console.log("update htacces");
    await replace({
        regex: "###PATH###",
        replacement: base_href,
        paths: ['../../dist/htaccess'],
        recursive: true,
        silent: true
    });

    //JSON-Folder zippen
    const zipFolder = require('zip-a-folder');
    console.log("zip data");
    await zipFolder.zip('../../dist', '../../myDist.zip')

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
    await sftp.connect({
        host: connection[targetMachine].host,
        port: '22',
        username: connection[targetMachine].user,
        password: connection[targetMachine].password
    });

    //gibt es schon einen Ordner (shp)
    console.log("check if exists: " + server_audio_path)
    const dir_exists = await sftp.exists(server_audio_path);

    //Wenn Ordner (shp) existiert, diesen rekursiv loeschen
    if (dir_exists) {
        console.log("delete folder " + server_audio_path);
        await sftp.rmdir(server_audio_path, true);
    }

    //neuen Ordner (shp) anlegen
    console.log("create folder " + server_audio_path);
    await sftp.mkdir(server_audio_path);

    //gezippten Webseiten-Code hochladen
    console.log("upload zip file");
    await sftp.fastPut("../../myDist.zip", server_audio_path + "/myDist.zip");

    //per SSH verbinden, damit Shell-Befehle ausgefuehrt werden koennen
    console.log("connect via ssh");
    await ssh.connect();

    //Webseiten-Code entzippen
    console.log("unzip file");
    await ssh.exec("cd " + server_audio_path + " && unzip myDist.zip");

    //htaccess file umbenennen (htaccess -> .htaccess)
    console.log("rename htaccess file");
    await ssh.exec("mv " + server_audio_path + "/htaccess " + server_audio_path + "/.htaccess")

    //Zip-File loeschen
    console.log("delete zip file");
    await sftp.delete(server_audio_path + "/myDist.zip");

    //Rechte anpassen, damit Daten in Webseite geladen werden koennen
    console.log("chmod 0777");
    await ssh.exec("chmod -R 0777 /var/www/html");

    //Programm beenden
    console.log("build process done");
    await ssh.close();
    await sftp.end();
    process.exit();
}

//Deployment starten
main();