import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QueueRowComponent } from './components/queue-row/queue-row.component';
import dummyData from './components/queue-row/dummy-data.json';
import type { QueueRowTrackData } from './components/queue-row/queue-row.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, QueueRowComponent],
})
export class AppComponent {
  protected title = 'SpotifyBetterJams';
  protected dummyData = dummyData;
  protected trackData: QueueRowTrackData;
  protected upvoteCount = 0;
  protected upvoted = false;

  public constructor() {
    this.trackData = this.createTrackData(dummyData);
  }

  protected vote(): void {
    this.upvoted = true;
    this.upvoteCount++;
  }

  protected removeVote(): void {
    this.upvoted = false;
    this.upvoteCount--;
  }

  private createTrackData(data: typeof dummyData): QueueRowTrackData {
    return {
      albumCoverUrl: data.album.images[0].url,
      songName: data.name,
      artistName: data.artists[0].name,
    };
  }
}
