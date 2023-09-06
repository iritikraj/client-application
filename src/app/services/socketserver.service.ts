import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketserverService {
  socketServerUrl: any;
  constructor() { }

  socketServer(){
    return this.socketServerUrl = 'http://localhost:3000'
  }
}
