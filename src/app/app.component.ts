import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import dummyData from './dummy-data/track-data.json';
import { Track } from './types/track.interfaces';
import { MediaPlayerComponent } from './components/media-player/media-player.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [RouterOutlet, MediaPlayerComponent],
})
export class AppComponent {
  title = 'SpotifyBetterJams';
  dummyData = dummyData;
  trackData: Track;
  upvoteCount = 0;
  upvoted = false;

  constructor() {
    this.trackData = this.createTrackData(dummyData);
  }

  private createTrackData(data: typeof dummyData): Track {
    return {
      albumCoverUrl: data.album.images[0].url,
      songName: data.name,
      artistName: data.artists[0].name,
      songDuration: data.duration_ms,
    }
  }

  protected vote() {
    this.upvoted = true;
    this.upvoteCount++;
    console.log('upvoted')
  }

  protected removeVote() {
    this.upvoted = false;
    this.upvoteCount--;
  }
 }
