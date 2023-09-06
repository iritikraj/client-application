import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import io from 'socket.io-client';
import { fromEvent } from 'rxjs';
import { tap, switchMap, takeUntil, finalize } from 'rxjs/operators'; //
import { Router } from '@angular/router';
import { SocketserverService } from '../services/socketserver.service';
@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})

export class Page1Component {
  @ViewChild('drawingCanvas') canvasForDrawing!: ElementRef<HTMLCanvasElement>;
  private socketServer: any = null;
  private ctx: CanvasRenderingContext2D | any = null;
  private isdrawing: any;

  constructor(private router: Router, private socketService: SocketserverService) {
    this.socketServer = io(this.socketService.socketServer()); // Our Socket Server URL
  }

  ngOnInit() { }

  ngAfterViewInit() {
    const canvas = this.canvasForDrawing.nativeElement;
    /**
     * The getContext method is a built-in method of the HTML5 canvas element. 
     * It returns a drawing context on which we can draw things. 
     * The '2d' argument passed to getContext means that we want to get a 2D rendering context, which is used for 2D drawing.
     */
    this.ctx = canvas.getContext('2d');

    /**
     * mouseDown$ is an observable that emits MouseEvent objects
     * whenever the mouse button is pressed down on the canvas.
     * 
     * mouseMove$ is an observable that emits MouseEvent objects 
     * whenever the mouse is moved over the canvas.
     * 
     * mouseUp$ is an observable that emits MouseEvent objects
     * whenever the mouse button is released.
     */
    const mouseDown$ = fromEvent<MouseEvent>(canvas, 'mousedown');
    const mouseMove$ = fromEvent<MouseEvent>(canvas, 'mousemove');
    const mouseUp$ = fromEvent<MouseEvent>(window, 'mouseup');

    /**
     * Here we are handling mouse events on the canvas..
     * mouseDown$: will start listening as soon as the mouse button is pressed then startDrawing() will execute taking event
     * as a parameter.
     * 
     * switchMap is a operator (RxJs) which is used to switch to a new observable whenever a new mouse down event occurs.
    */
    this.isdrawing = mouseDown$.pipe(switchMap(event => {
      this.startDrawing(event);

      /**
       * Here we are subscribing to the mouseMove$ observable (which emits event when the mouse is moved)  
       * and then calling mouseMove() function whenever a mouse move event is emitted.
       * 
       * The tap operator is used to call the draw function everytime mouseMove$ emits a mousemove event
       * 
       * The takeUntil operator is used to complete the observable when the mouseUp$ 
       * observable emits an event.which means that the mouseMove$ observable will stop emitting events
       * once the mouse button is released.
       */
      return mouseMove$.pipe(tap(event => this.draw(event)),
        takeUntil(mouseUp$)
      );
    }),
      finalize(() => this.endDrawing())).subscribe(); //when the observable completes then endDrawing() function will be called. 
  }

  startDrawing(event: any) {
    this.ctx.beginPath(); //Starting path on the canvas using beginPath()
    this.ctx.moveTo(event.offsetX, event.offsetY); //Moving the starting point of the path to the calculated coordinates using moveTo(x, y)
  }


  draw(event: MouseEvent) {
    const { offsetX, offsetY } = event;

    //We'll use lineTo() on the ctx(canvas context) to draw from the current position to the calculated x and y coordinates.
    this.ctx.lineTo(offsetX, offsetY);

    //The stroke method will draw the line on the canvas.
    this.ctx.stroke();

    //The getBoundingClientRect is called on canvasForDrawing.nativeElement element to get position of the canvas.
    const { left, top } = this.canvasForDrawing.nativeElement.getBoundingClientRect();

    //We'll use clientX and clientY properties of the event object to get the position of the mouse cursor.
    const { clientX, clientY } = event;

    //Here we're calculating the x and y variables values by subtracting the canvas position from the mouse cursor position.
    const relativeX = clientX - left;
    const relativeY = clientY - top;

    //The socketServer.emit method is called to send the drawing data to the server.
    this.socketServer.emit('draw', { x: relativeX, y: relativeY });
  }

  /**
   * The endDrawing() function is used to end drawing on the canvas.
   * It closes the current path on the canvas context.
   */
  endDrawing() {
    this.ctx.closePath();
  }

  openDisPlayPageInNewTab() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/page2`])
    );
    window.open(url, '_blank');
  }
}
