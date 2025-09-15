import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QueueRowComponent } from './components/queue-row/queue-row.component';
import { Track } from '../types/track.interfaces';
import trackData from '../dummy-data/track-data.json';
import { MediaPlayerComponent } from "./components/media-player/media-player.component";

@Component({
  selector: 'app-room-page',
  standalone: true,
  imports: [QueueRowComponent, MediaPlayerComponent],
  templateUrl: './room-page.component.html',
  styleUrl: './room-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomPageComponent { 
    dummyData = trackData;
  trackData: Track;
  upvoteCount = 0;
  upvoted = false;

  constructor() {
    this.trackData = this.createTrackData(trackData);
  }

  private createTrackData(data: typeof trackData): Track {
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
