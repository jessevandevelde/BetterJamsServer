import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import MediaPlayerComponent from './room-page/components/media-player/media-player.component';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<app-media-player></app-media-player>`,
  styleUrls: ['./app.component.css'],
  imports: [MediaPlayerComponent],
})
export class AppComponent {
  title = 'SpotifyBetterJams';
  constructor() {}


}
