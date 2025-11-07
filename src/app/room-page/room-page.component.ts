import type { OnDestroy, Signal, WritableSignal } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { QueueRowComponent } from './components/queue-row/queue-row.component';
import type { QueueTrack, Track } from '../types/track.interfaces';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { Store } from '@ngrx/store';
import { RoomPageActions } from './store';
import { selectQuery, selectSearchIsLoading, selectSearchResults, selectQueueTracks, selectUserHasData } from './store/room-page.selectors';
import { RoomPageService } from './room-page.service';
import { getQueueTracks } from './store/room-page.actions';
import { WebsocketService } from '../services/websocket.service';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import type { User } from '../types/user.interfaces';

@Component({
  selector: 'app-room-page',
  standalone: true,
  imports: [QueueRowComponent, MediaPlayerComponent, SearchBarComponent, UserProfileComponent],
  templateUrl: './room-page.component.html',
  styleUrl: './room-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomPageComponent implements OnDestroy {
  public upvoteCount = 0;
  public upvoted = false;
  public isPlaying = true;
  public isLoading: Signal<boolean>;
  protected currentTrack: WritableSignal<Track | null> = signal(null);
  protected currentTrackProgress = signal(0);
  protected searchQuery: Signal<string>;
  protected searchResults: Signal<Track[]>;
  protected queueTracks: Signal<QueueTrack[]>;
  protected userProfile: Signal<User | null>;
  private readonly store = inject(Store);
  private readonly roomPageService = inject(RoomPageService);
  private readonly websocketService: WebsocketService = inject(WebsocketService);

  public constructor() {
    this.searchQuery = this.store.selectSignal(selectQuery);
    this.searchResults = this.store.selectSignal(selectSearchResults);
    this.isLoading = this.store.selectSignal(selectSearchIsLoading);
    this.queueTracks = this.store.selectSignal(selectQueueTracks);
    this.userProfile = this.store.selectSignal(selectUserHasData);

    this.initializeQueueUpdatedWebsocket();
    this.initializeCurrentTrackWebsocket();
    this.store.dispatch(getQueueTracks());
    this.initializeGetUserProfile();
  }

  public ngOnDestroy(): void {
    this.websocketService.disconnect();
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

  protected searchQueryChange(query: string): void {
    this.store.dispatch(RoomPageActions.setSearchQuery({ query }));
  }

  protected addTrack(track: Track): void {
    this.roomPageService.addTrackToQueue(track).subscribe();
  }

  protected initializeCurrentTrackWebsocket(): void {
    this.websocketService.socket.on('current-track', (data: { track: Track, progressMs: number }) => {
      this.currentTrack.set(data.track);
      this.currentTrackProgress.set(data.progressMs);
      this.roomPageService.playTrack().subscribe();
    });
  }

  protected initializeGetUserProfile(): void {
    this.store.dispatch(RoomPageActions.getUserProfile());
  }
}
