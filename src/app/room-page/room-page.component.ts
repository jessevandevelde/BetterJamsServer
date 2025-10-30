import type { Signal } from '@angular/core';
import { ChangeDetectionStrategy, Component, ChangeDetectorRef, inject } from '@angular/core';
import { QueueRowComponent } from './components/queue-row/queue-row.component';
import type { Track } from '../types/track.interfaces';
import trackData from '../dummy-data/track-data.json';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { Store } from '@ngrx/store';
import { RoomPageActions } from './store';
import { selectQuery, selectSearchIsLoading, selectSearchResults } from './store/room-page.selectors';
import { RoomPageService } from './room-page.service';

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
  public isLoading: Signal<boolean>;
  protected dummyData = trackData;
  protected trackData: Track;
  protected tracks: Track[];
  protected progress = 0;
  protected progressPercentage = 0;
  protected searchQuery: Signal<string>;
  protected searchResults: Signal<Track[]>;
  private readonly cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly store: Store;
  private readonly roomPageService = inject(RoomPageService);

  public constructor() {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
    this.store = inject(Store);
    this.searchQuery = this.store.selectSignal(selectQuery);
    this.searchResults = this.store.selectSignal(selectSearchResults);
    this.isLoading = this.store.selectSignal(selectSearchIsLoading);
    this.trackData = this.createTrackData(trackData);
    this.tracks = [this.createTrackData(trackData), this.createTrackData(trackData)];
    setInterval(() => {
      if (this.isPlaying) {
        const progress = this.progress >= this.trackData.durationMs
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

  protected clearSearch(): void {
    this.store.dispatch(RoomPageActions.resetSearchField());
  }

  protected searchQueryChange(query: string): void {
    this.store.dispatch(RoomPageActions.setSearchQuery({ query }));
  }

  protected addTrack(track: Track): void {
    this.roomPageService.addTrackToQueue(track).subscribe();
  }

  private createTrackData(data: typeof trackData): Track {
    return {
      albumCoverUrl: data.album.images[0].url,
      name: data.name,
      artists: data.artists[0].name,
      durationMs: data.duration_ms,
      id: '',
      uri: '',
    };
  }
}
