import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QueueRowComponent } from './components/queue-row/queue-row.component';
import dummyData from './components/queue-row/dummy-data.json';
import { QueueRowTrackData } from './components/queue-row/queue-row.interfaces';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [RouterOutlet, QueueRowComponent],
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
