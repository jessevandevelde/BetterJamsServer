import { ChangeDetectionStrategy, Component, ChangeDetectorRef, inject } from '@angular/core';
import { QueueRowComponent } from './components/queue-row/queue-row.component';
import type { Track } from '../types/track.interfaces';
import trackData from '../dummy-data/track-data.json';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';

const ONE_SECOND_IN_MS = 1000;

@Component({
  selector: 'app-room-page',
  standalone: true,
  imports: [QueueRowComponent, MediaPlayerComponent, SearchBarComponent],
  templateUrl: './room-page.component.html',
  styleUrl: './room-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomPageComponent {
  public upvoteCount = 0;
  public upvoted = false;
  public isPlaying = true;

  protected dummyData = trackData;
  protected trackData: Track;
  protected progress = 0;
  protected progressPercentage = 0;

  private readonly cd: ChangeDetectorRef = inject(ChangeDetectorRef);

  public constructor() {
    this.trackData = this.createTrackData(trackData);

    setInterval(() => {
      if (this.isPlaying) {
        const progress = this.progress >= this.trackData.songDuration
          ? 0
          : this.progress + ONE_SECOND_IN_MS;

        this.progress = progress;
        this.cd.detectChanges();
      }
    }, ONE_SECOND_IN_MS);
  }

  protected vote(): void {
    this.upvoted = true;
    this.upvoteCount++;
  }

  protected removeVote(): void {
    this.upvoted = false;
    this.upvoteCount--;
  }

  protected pauseTrack(): void {
    this.isPlaying = false;
  }

  protected playTrack(): void {
    this.isPlaying = true;
  }

  private createTrackData(data: typeof trackData): Track {
    return {
      albumCoverUrl: data.album.images[0].url,
      songName: data.name,
      artistName: data.artists[0].name,
      songDuration: data.duration_ms,
    };
  }
}
