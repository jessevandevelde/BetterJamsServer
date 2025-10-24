import type { Signal } from '@angular/core';
import { ChangeDetectionStrategy, Component, ChangeDetectorRef, inject } from '@angular/core';
import { QueueRowComponent } from './components/queue-row/queue-row.component';
import type { Track } from '../types/track.interfaces';
import trackData from '../dummy-data/track-data.json';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { Store } from '@ngrx/store';
import { RoomPageActions } from './store';
import { selectIsLoading, selectQuery, selectQueueTracks } from './store/room-page.selectors';
import { selectTracks } from './store/room-page.selectors';
import { RoomPageService } from './room-page.service';
import { getQueueTracks } from './store/room-page.actions';
import { WebsocketService } from '../services/websocket.service';

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
  protected progress = 0;
  protected progressPercentage = 0;
  protected searchValue: Signal<string>;
  protected searchResult: Signal<Track[]>;
  protected queueTracks: Signal<Track[]>;
  private readonly cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly store: Store;
  private readonly roomPageService = inject(RoomPageService);
  private readonly websocketService: WebsocketService;

  public constructor() {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
    this.store = inject(Store);
    this.websocketService = inject(WebsocketService);
    this.searchValue = this.store.selectSignal(selectQuery);
    this.searchResult = this.store.selectSignal(selectTracks);
    this.isLoading = this.store.selectSignal(selectIsLoading);
    this.queueTracks = this.store.selectSignal(selectQueueTracks);
    this.trackData = this.createTrackData(trackData);

    this.store.dispatch(getQueueTracks());

    setInterval(() => {
      if (this.isPlaying) {
        const progress = this.progress >= this.trackData.durationMs
          ? 0
          : this.progress + ONE_SECOND_IN_MS;

        this.progress = progress;
        this.cd.detectChanges();
      }
    }, ONE_SECOND_IN_MS);
    console.log(this.websocketService.socket);
    this.websocketService.socket.on('connect', () => {
      console.log('queue updated');
    });
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

  protected searchSong(query: string): void {
    this.store.dispatch(RoomPageActions.searchTracks({ query }));
  }

  protected addSong(track: Track): void {
    this.roomPageService.postSong(track).subscribe();
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
