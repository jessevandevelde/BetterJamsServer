import { Component, OnInit } from '@angular/core';
import { QueueRowComponent } from './components/queue-row/queue-row.component';
import dummyData from './components/queue-row/dummy-data.json';
import { QueueRowTrackData } from './components/queue-row/queue-row.interfaces';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<app-queue-row [track]="trackData"></app-queue-row>`,
  styleUrls: ['./app.component.css'],
  imports: [QueueRowComponent],
})
export class AppComponent {
  title = 'SpotifyBetterJams';
  dummyData = dummyData;
  trackData: QueueRowTrackData;

  constructor() {
    this.trackData = this.createTrackData(dummyData);
  }

  private createTrackData(data: typeof dummyData): QueueRowTrackData {
    return {
      albumCoverUrl: data.album.images[0].url,
      songName: data.name,
      artistName: data.artists[0].name,
    }
  }
 }
