import { Injectable } from "@angular/core";
import * as io from "socket.io-client";

@Injectable({
  providedIn: "root"
})
export class SocketService {
  socket;
  constructor() {
    this.socket = io("http://localhost:3000");
  }
}
