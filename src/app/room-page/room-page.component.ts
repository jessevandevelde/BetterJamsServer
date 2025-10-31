import type { Signal } from '@angular/core';
import { ChangeDetectionStrategy, Component, ChangeDetectorRef, inject } from '@angular/core';
import { QueueRowComponent } from './components/queue-row/queue-row.component';
import type { Track } from '../types/track.interfaces';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { Store } from '@ngrx/store';
import { RoomPageActions } from './store';
import { selectIsLoading, selectQuery, selectQueueTracks, selectTracks } from './store/room-page.selectors';
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
  protected trackData: Track | null = null;
  protected progress = 0;
  protected progressPercentage = 0;
  protected searchValue: Signal<string>;
  protected searchResult: Signal<Track[]>;
  protected queueTracks: Signal<Track[]>;
  private readonly cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly store = inject<Store>(Store);
  private readonly roomPageService = inject(RoomPageService);
  private readonly websocketService: WebsocketService = inject(WebsocketService);

  public constructor() {
    this.searchValue = this.store.selectSignal(selectQuery);
    this.searchResult = this.store.selectSignal(selectTracks);
    this.isLoading = this.store.selectSignal(selectIsLoading);
    this.queueTracks = this.store.selectSignal(selectQueueTracks);

    this.initializeQueueUpdatedWebsocket();
    this.getCurrentTrack();
    this.store.dispatch(getQueueTracks());

    setInterval(() => {
      if (this.isPlaying && this.trackData) {
        const progress = this.progress >= this.trackData.durationMs
          ? 0
          : this.progress + ONE_SECOND_IN_MS;

        this.progress = progress;
        this.cd.detectChanges();
      }
    }, ONE_SECOND_IN_MS);
  }

  protected initializeQueueUpdatedWebsocket(): void {
    this.websocketService.socket.on('queue-updated', () => {
      this.store.dispatch(getQueueTracks());
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

  protected getCurrentTrack(): void {
    this.websocketService.socket.on('current-track', (data: { track: Track, progressMs: number }) => {
      this.trackData = data.track;
      this.progress = data.progressMs;
      this.cd.detectChanges();
      console.log(data);
      this.roomPageService.playTrack().subscribe();
    });
  }
}
