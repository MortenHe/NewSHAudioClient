import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  //HoverTitel als BehaviourSubject (fuer Anzeige welche Titel einfuegt wird)
  private hoverTitle = new BehaviorSubject<string>("");

  //Position welche Titel gearde geladen wird (fuer Spinner in Anzeige)
  private jumpPosition = new BehaviorSubject<number>(-1);

  constructor() { }

  setJumpPosition(jumpPosition) {
    this.jumpPosition.next(jumpPosition);
  }

  setHoverTitle(hoverTitle) {
    this.hoverTitle.next(hoverTitle);
  }

  getJumpPosition() {
    return this.jumpPosition;
  }

  getHoverTitle() {
    return this.hoverTitle;
  }
}
