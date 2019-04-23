import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject, BehaviorSubject, Observable, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BackendService {

  //URL fuer Server (um App per PHP aktivieren zu koennen)
  serverUrl = environment.serverUrl;

  //URL fuer WebSocketServer
  wssUrl = environment.wssUrl;

  //WebSocket
  socket: Subject<any>;

  //produktiv-System?
  production = environment.production;

  //Liste der Dateien
  files$: Subject<any[]> = new Subject<any[]>();

  //Lautstaerke
  volume$: Subject<number> = new Subject<number>();

  //Position der Datei, die gerade gespielt wird
  position$: Subject<number> = new Subject<number>();

  //Offset wo Datei eingereiht wird
  insertOffset$: Subject<number> = new Subject<number>();

  //aktueller Pause-Zustand
  paused$: Subject<boolean> = new Subject<boolean>();

  //aktueller Random-Zustand
  random$: Subject<boolean> = new Subject<boolean>();

  //wurde Server heruntergefahren?
  shutdown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  //Ist die App gerade mit dem WSS verbunden?
  connected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  //Services injekten
  constructor(private _http: HttpClient) {

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

          //Wenn es nicht nur ein Ping Message ist (die ggf. Verbindung wieder herstellt)
          if (data["type"] !== "ping") {

            //Nachricht an WSS schicken
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

    //auf Nachrichten vom Server reagieren
    this.socket.subscribe(message => {

      //console.log((JSON.parse(message.data.toString())));
      let obj = JSON.parse(message.data);
      let value = obj.value;

      //Switch anhand Message-Types
      switch (obj.type) {
        case "set-files":
          this.files$.next(value);
          break;

        case "change-volume":
          this.volume$.next(value);
          break;

        case "set-position":
          this.position$.next(value);
          break;

        case "set-insert-offset":
          this.insertOffset$.next(value);
          break;

        case "toggle-paused":
          this.paused$.next(value);
          break;

        case "toggle-random":
          this.random$.next(value);
          break;

        case "shutdown":
          this.shutdown$.next(true);
          break;
      }
    });
  }

  //Nachricht an WSS schicken
  sendMessage(messageObj) {
    //console.lconsole.log(messageObj);
    this.socket.next(messageObj);
  }

  //files liefern
  getFiles() {
    return this.files$;
  }

  //Volume liefern
  getVolume() {
    return this.volume$;
  }

  //Position liefern
  getPosition() {
    return this.position$;
  }

  //Position liefern
  getInsertOffeset() {
    return this.insertOffset$;
  }

  //Pause liefern
  getPaused() {
    return this.paused$;
  }

  //Random liefern
  getRandom() {
    return this.random$;
  }

  //Shutdown Zustand liefern
  getShutdown() {
    return this.shutdown$;
  }

  //Verbindungszustand mit WSS liefern
  getConnected() {
    return this.connected$;
  }

  //App aktivieren = WSS starten
  activateApp() {
    return this._http.get(this.serverUrl + "/php/activateApp.php?mode=sh");
  }
}