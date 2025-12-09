import type { OnDestroy, Signal } from '@angular/core';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { QueueRowComponent } from './components/queue-row/queue-row.component';
import type { QueueTrack, Track } from '../types/track.interfaces';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { Store } from '@ngrx/store';
import { RoomPageActions } from './store';
import { selectQuery, selectSearchIsLoading, selectSearchResults, selectQueueTracks, selectUserHasData, selectUserIsLoading, selectDevices, selectDevicesHasLoaded, selectActiveDeviceId, selectDevicesIsLoading, selectCurrentTrack } from './store/room-page.selectors';
import { RoomPageService } from './room-page.service';
import { getQueueTracks } from './store/room-page.actions';
import { WebsocketService } from '../services/websocket.service';
import { WebsocketEvent } from '../services/websocket.enums';
import type { Device } from '../types/devices.interface';
import { SelectDevicesModal } from './components/select-devices-modal/select-devices-modal.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import type { User } from '../types/user.interfaces';
import { EmptyQueuePlaceholder } from './components/empty-queue/empty-queue-placeholder.component';
import { LoadingStateComponent } from '../components/loading-state/loading-state.component';

@Component({
  selector: 'app-room-page',
  standalone: true,
  imports: [QueueRowComponent, MediaPlayerComponent, SearchBarComponent, UserProfileComponent, EmptyQueuePlaceholder, SelectDevicesModal, LoadingStateComponent],
  templateUrl: './room-page.component.html',
  styleUrl: './room-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RoomPageComponent implements OnDestroy {
  public voted = false;
  public isPlaying = true;
  public isLoading: Signal<boolean>;

  protected currentTrack: Signal<Track | null>;
  protected currentTrackProgress = signal(0);
  protected searchQuery: Signal<string>;
  protected searchResults: Signal<Track[]>;
  protected queueTracks: Signal<QueueTrack[]>;
  protected userProfile: Signal<User | null>;
  protected userIsLoading: Signal<boolean>;
  protected devices: Signal<Device[]>;
  protected showSelectDevicesModal = signal(false);
  protected devicesHasLoaded: Signal<boolean>;
  protected activeDeviceId: Signal<string>;
  protected devicesIsLoading: Signal<boolean>;

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
    this.devices = this.store.selectSignal(selectDevices);
    this.devicesIsLoading = this.store.selectSignal(selectDevicesIsLoading);
    this.devicesHasLoaded = this.store.selectSignal(selectDevicesHasLoaded);
    this.activeDeviceId = this.store.selectSignal(selectActiveDeviceId);
    this.currentTrack = this.store.selectSignal(selectCurrentTrack);

    this.initializeQueueUpdatedWebsocket();
    this.initializeCurrentTrackWebsocket();
    this.initializeCurrentTrackProgressWebsocket();
    this.store.dispatch(getQueueTracks());
    this.getUserProfile();
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

  protected setSelectedDeviceId(activeDeviceId: string): void {
    this.store.dispatch(RoomPageActions.setActiveDeviceId({ activeDeviceId }));
  }

  private setActiveDeviceId(devices: Device[]): void {
    const activeDeviceId = this.getActiveDeviceId(devices);

    if (activeDeviceId) {
      this.store.dispatch(RoomPageActions.setActiveDeviceId({ activeDeviceId }));
    }
    else {
      this.showSelectDevicesModal.set(true);
    }
  }

  private getActiveDeviceId(devices: Device[]): string | null {
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
      this.store.dispatch(RoomPageActions.setCurrentTrack({ currentTrack: track }));

      this.store.dispatch(RoomPageActions.playTrack());
    });
  }

  private initializeCurrentTrackProgressWebsocket(): void {
    this.websocketService.socket.on(WebsocketEvent.currentTrackProgress, (progressMs: number) => {
      this.currentTrackProgress.set(progressMs);
    });
  }
}
