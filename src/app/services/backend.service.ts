import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BackendService {

  //URL fuer Server (um App per PHP aktivieren zu koennen)
  serverUrl: string;

  //URL fuer WebSocketServer
  wssUrl: string;

  //WebSocket
  socket: Subject<any>;

  //Liste des Audiomodus (sh, mh, kids)
  audioModes$: Subject<any[]> = new Subject<any[]>();

  //Ausgewaehlter Audiomodus (sh, mh, kids)
  audioMode$: Subject<string> = new Subject<string>();

  //Liste der Dateien
  files$: Subject<any[]> = new Subject<any[]>();

  //Lautstaerke
  volume$: Subject<number> = new Subject<number>();

  //Countdownzeit
  countdownTime$: Subject<number> = new Subject<number>();

  //Index wo Datei eingereiht wird
  insertIndex$: Subject<number> = new Subject<number>();

  //aktueller Pause-Zustand
  paused$: Subject<boolean> = new Subject<boolean>();

  //Usermode (um HTML-Seitentitel aendern zu koennen)
  userMode$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  //wurde Server heruntergefahren?
  shutdown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  //Ist die App gerade mit dem WSS verbunden?
  connected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  //Services injekten
  constructor(private _http: HttpClient) {

    //IP-Adresse des Servers ermittln und daraus Links zu WSS und PHP-Skript erstellen
    const host = window.location.hostname;
    this.serverUrl = 'http://' + host + '/php';
    this.wssUrl = 'ws://' + host + ':9090';

    //WebSocket erstellen
    this.createWebsocket();
  }

  //Verbindung zu WSS herstellen
  public createWebsocket() {

    //Socket-Verbindung mit URL aus Config anlegen
    let socket = new WebSocket(this.wssUrl);
    let observable = Observable.create(
      (observer: Observer<MessageEvent>) => {
        socket.onmessage = observer.next.bind(observer);
        socket.onerror = observer.error.bind(observer);
        socket.onclose = observer.complete.bind(observer);
        return socket.close.bind(socket);
      }
    );
    let observer = {
      next: (data: Object) => {

        //Wenn Verbindung zu WSS existiert
        if (socket.readyState === WebSocket.OPEN) {

          //App ist mit WSS verbunden
          this.connected$.next(true);

          //Wenn es nicht nur ein Ping Message ist (die ggf. Verbindung wieder herstellt) -> Nachricht an WSS schicken
          if (data["type"] !== "ping") {
            socket.send(JSON.stringify(data));
          }
        }

        //keine Verbindung zu WSS
        else {

          //App ist nicht mit WSS verbunden
          this.connected$.next(false);
          //console.log("ready state ist " + socket.readyState)

          //Verbindung zu WSS wieder herstellen                    
          this.createWebsocket();
        }
      }
    };

    //WebSocket anlegen
    this.socket = Subject.create(observer, observable);

    //auf Nachrichten === VOM SERVER === reagieren
    this.socket.subscribe(message => {

      //console.log((JSON.parse(message.data.toString())));
      let obj = JSON.parse(message.data);
      let value = obj.value;

      //Switch anhand Message-Types
      switch (obj.type) {
        case "audioModes":
          this.audioModes$.next(value);
          break;

        case "audioMode":
          this.audioMode$.next(value);
          break;

        case "files":
          this.files$.next(value);
          break;

        case "volume":
          this.volume$.next(value);
          break;

        case "countdownTime":
          this.countdownTime$.next(value);
          break;

        case "insertIndex":
          this.insertIndex$.next(value);
          break;

        case "paused":
          this.paused$.next(value);
          break;

        case "userMode":
          this.userMode$.next(value);
          break;

        case "shutdown":
          this.shutdown$.next(true);
          break;
      }
    });
  }

  //Nachricht === AN SERVER === schicken
  sendMessage(messageObj) {
    //console.lconsole.log(messageObj);
    this.socket.next(messageObj);
  }

  getAudioModes() {
    return this.audioModes$;
  }

  getAudioMode() {
    return this.audioMode$;
  }

  getFiles() {
    return this.files$;
  }

  getVolume() {
    return this.volume$;
  }

  getCountdownTime() {
    return this.countdownTime$;
  }

  getInsertIndex() {
    return this.insertIndex$;
  }

  getPaused() {
    return this.paused$;
  }

  getUserMode() {
    return this.userMode$;
  }

  getShutdown() {
    return this.shutdown$;
  }

  getConnected() {
    return this.connected$;
  }

  //App per PHP Aufruf aktivieren = WSS starten
  activateApp() {
    return this._http.get(this.serverUrl + "/activateAudioApp.php?mode=sh");
  }
}