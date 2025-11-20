import type { OnDestroy, Signal, WritableSignal } from '@angular/core';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { QueueRowComponent } from './components/queue-row/queue-row.component';
import type { QueueTrack, Track } from '../types/track.interfaces';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { Store } from '@ngrx/store';
import { RoomPageActions } from './store';
import { selectQuery, selectSearchIsLoading, selectSearchResults, selectQueueTracks, selectDevices, selectDevicesHasLoaded, selectActiveDeviceId } from './store/room-page.selectors';
import { RoomPageService } from './room-page.service';
import { getQueueTracks } from './store/room-page.actions';
import { WebsocketService } from '../services/websocket.service';
import { WebsocketEvent } from '../services/websocket.enums';
import type { SpotifyDevice } from '../types/devices.interface';
import { SelectDevicesModal } from './components/select-devices-modal/select-devices-modal.component';

@Component({
  selector: 'app-room-page',
  standalone: true,
  imports: [QueueRowComponent, MediaPlayerComponent, SearchBarComponent, SelectDevicesModal],
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
  protected devices: Signal<SpotifyDevice[]>;
  protected showSelectDevicesModal = signal(false);
  protected devicesHasLoaded: Signal<boolean>;
  protected activeDeviceId: Signal<string>;

  private readonly store = inject(Store);
  private readonly roomPageService = inject(RoomPageService);
  private readonly websocketService: WebsocketService = inject(WebsocketService);

  public constructor() {
    this.searchQuery = this.store.selectSignal(selectQuery);
    this.searchResults = this.store.selectSignal(selectSearchResults);
    this.isLoading = this.store.selectSignal(selectSearchIsLoading);
    this.queueTracks = this.store.selectSignal(selectQueueTracks);
    this.devices = this.store.selectSignal(selectDevices);
    this.devicesHasLoaded = this.store.selectSignal(selectDevicesHasLoaded);
    this.activeDeviceId = this.store.selectSignal(selectActiveDeviceId);

    this.initializeQueueUpdatedWebsocket();
    this.initializeCurrentTrackWebsocket();
    this.initializeCurrentTrackProgressWebsocket();
    this.store.dispatch(getQueueTracks());
    this.getDevices();

    effect(() => {
      if (this.devicesHasLoaded()) {
        const devices = this.devices();

        this.setActiveDeviceId(devices);
      }
    });
  }

  public ngOnDestroy(): void {
    this.websocketService.disconnect();
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

  protected setSelectedDeviceId(activeDeviceId: string): void {
    this.store.dispatch(RoomPageActions.setActiveDeviceId({ activeDeviceId }));
    this.store.dispatch(RoomPageActions.playTrack());
  }

  private setActiveDeviceId(devices: SpotifyDevice[]): void {
    const activeDeviceId = this.getActiveDeviceId(devices);

    if (activeDeviceId) {
      this.store.dispatch(RoomPageActions.setActiveDeviceId({ activeDeviceId }));
      this.store.dispatch(RoomPageActions.playTrack());
    }
    else {
      this.showSelectDevicesModal.set(true);
    }
  }

  private getActiveDeviceId(devices: SpotifyDevice[]): string | null {
    if (!devices.length) {
      return null;
    }

    if (devices.length === 1) {
      const activeDevice = devices[0].id;

      return activeDevice;
    }

    const activeDevice = devices.find((device) => {
      return device.is_active;
    });

    return activeDevice?.id ?? null;
  }

  private getDevices(): void {
    this.store.dispatch(RoomPageActions.getDevices());
  }

  private initializeQueueUpdatedWebsocket(): void {
    this.websocketService.socket.on(WebsocketEvent.queueUpdated, () => {
      this.store.dispatch(getQueueTracks());
    });
  }

  private initializeCurrentTrackWebsocket(): void {
    this.websocketService.socket.on(WebsocketEvent.currentTrack, (track: Track) => {
      this.currentTrack.set(track);

      this.store.dispatch(RoomPageActions.playTrack());
    });
  }

  private initializeCurrentTrackProgressWebsocket(): void {
    this.websocketService.socket.on(WebsocketEvent.currentTrackProgress, (progressMs: number) => {
      this.currentTrackProgress.set(progressMs);
    });
  }
}
