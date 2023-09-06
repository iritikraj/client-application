import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import io from 'socket.io-client';
import { SocketserverService } from '../services/socketserver.service';
@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.scss'],
})
export class Page2Component implements OnInit {
  @ViewChild('canvasDisplay') displayCanvas!: ElementRef<HTMLCanvasElement>;
  socketServer: any;
  private ctx: CanvasRenderingContext2D | any = null;

  constructor(private socketService: SocketserverService) {
    // Initialize socket connection to the server
    this.socketServer = io(this.socketService.socketServer()); // Our Socket Server URL
  }

  ngOnInit() { }

  /**
   * Here we are connecting with our server using a socket and listening for 
   * incoming "draw" events. When a "draw" event is received, it updates the canvas by adding a 
   * line segment from the current position to the specified coordinates.
   */
  ngAfterViewInit(): void {
    const canvas = this.displayCanvas.nativeElement;
    this.ctx = canvas.getContext('2d');

    // Listen for drawing data from the server and update the canvas
    this.socketServer.on('draw', (data: any) => {
      this.ctx.lineTo(data.x, data.y);
      this.ctx.stroke();
    });
  }
  
}

