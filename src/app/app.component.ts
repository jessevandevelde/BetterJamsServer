import { Component } from '@angular/core';
import { QueueRowComponent } from './components/queue-row/queue-row.component';
import dummyData from './components/queue-row/dummy-data.json';
import type { QueueRowTrackData } from './components/queue-row/queue-row.interfaces';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { LoginPageComponent } from './login-page/login-page.component';
import type { Track } from './components/search-bar/search-bar.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [QueueRowComponent, SearchBarComponent, LoginPageComponent],
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

  private createTrackData(data: Track): QueueRowTrackData {
    return {
      albumCoverUrl: data.album.images[0].url,
      songName: data.name,
      artistName: data.artists[0].name,
    };
  }
}
