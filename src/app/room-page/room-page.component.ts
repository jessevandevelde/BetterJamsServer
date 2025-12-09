import type { OnDestroy, Signal, WritableSignal } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { QueueRowComponent } from './components/queue-row/queue-row.component';
import type { QueueTrack, Track } from '../types/track.interfaces';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { Store } from '@ngrx/store';
import { RoomPageActions } from './store';
import { selectQuery, selectSearchIsLoading, selectSearchResults, selectQueueTracks, selectUserHasData, selectUserIsLoading } from './store/room-page.selectors';
import { RoomPageService } from './room-page.service';
import { getQueueTracks } from './store/room-page.actions';
import { WebsocketService } from '../services/websocket.service';
import { WebsocketEvent } from '../services/websocket.enums';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import type { User } from '../types/user.interfaces';
import { EmptyQueuePlaceholder } from './components/empty-queue/empty-queue-placeholder.component';

@Component({
  selector: 'app-room-page',
  standalone: true,
  imports: [QueueRowComponent, MediaPlayerComponent, SearchBarComponent, UserProfileComponent, EmptyQueuePlaceholder],
  templateUrl: './room-page.component.html',
  styleUrl: './room-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomPageComponent implements OnDestroy {
  public voted = false;
  public isPlaying = true;
  public isLoading: Signal<boolean>;
  protected currentTrack: WritableSignal<Track | null> = signal(null);
  protected currentTrackProgress = signal(0);
  protected searchQuery: Signal<string>;
  protected searchResults: Signal<Track[]>;
  protected queueTracks: Signal<QueueTrack[]>;
  protected userProfile: Signal<User | null>;
  protected userIsLoading: Signal<boolean>;
  private readonly store = inject(Store);
  private readonly roomPageService = inject(RoomPageService);
  private readonly websocketService: WebsocketService = inject(WebsocketService);

  public constructor() {
    this.searchQuery = this.store.selectSignal(selectQuery);
    this.searchResults = this.store.selectSignal(selectSearchResults);
    this.isLoading = this.store.selectSignal(selectSearchIsLoading);
    this.queueTracks = this.store.selectSignal(selectQueueTracks);
    this.userProfile = this.store.selectSignal(selectUserHasData);
    this.userIsLoading = this.store.selectSignal(selectUserIsLoading);

    this.initializeQueueUpdatedWebsocket();
    this.initializeCurrentTrackWebsocket();
    this.initializeCurrentTrackProgressWebsocket();
    this.store.dispatch(getQueueTracks());
    this.getUserProfile();
  }

  public ngOnDestroy(): void {
    this.websocketService.disconnect();
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
    this.store.dispatch(RoomPageActions.resetSearchField());
  }

  protected voteTrack(track: QueueTrack): void {
    if (!this.userProfile()) {
      return;
    }

    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    this.roomPageService.voteTrack(track.uuid, this.userProfile()!.userId).subscribe();
  }

  protected getUserProfile(): void {
    this.store.dispatch(RoomPageActions.getUserProfile());
  }

  private initializeQueueUpdatedWebsocket(): void {
    this.websocketService.socket.on(WebsocketEvent.queueUpdated, () => {
      this.store.dispatch(getQueueTracks());
    });
  }

  private initializeCurrentTrackWebsocket(): void {
    this.websocketService.socket.on(WebsocketEvent.currentTrack, (track: Track) => {
      this.currentTrack.set(track);

      if (this.isPlaying) {
        this.roomPageService.playTrack().subscribe();
      }
    });
  }

  private initializeCurrentTrackProgressWebsocket(): void {
    this.websocketService.socket.on(WebsocketEvent.currentTrackProgress, (progressMs: number) => {
      this.currentTrackProgress.set(progressMs);
    });
  }
}
