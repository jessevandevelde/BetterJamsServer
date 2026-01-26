import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';
import { spotifyApiCallLink, spotifySearchLink } from 'src/app/environment';
import { Track } from '../types/track.interfaces';
import type { SearchResultsRemote } from '../types/track.interfaces';
import type { GetQueueDTO } from './room-page.interfaces';
import type { Device } from '../types/devices.interface';
import { Store } from '@ngrx/store';
import type { User } from '../types/user.interfaces';

@Injectable({
  providedIn: 'root',
})

export class RoomPageService {
  private readonly httpClient: HttpClient;
  private readonly store = inject(Store);

  public constructor() {
    this.httpClient = inject(HttpClient);
  }

  public search(query: string): Observable<Track[]> {
    return this.httpClient.get<SearchResultsRemote>(spotifySearchLink, {
      params: {
        query,
      },
      withCredentials: true,
    }).pipe(
      map((searchResultsRemote) => {
        return searchResultsRemote.tracks.items.map(trackRemote => new Track(trackRemote));
      }),
    );
  }

  public addTrackToQueue(track: Track): Observable<Track> {
    return this.httpClient.post<Track>(`${spotifyApiCallLink}/api/queue`, track, {
      withCredentials: true,
    });
  }

  public getQueue(): Observable<GetQueueDTO> {
    return this.httpClient.get<GetQueueDTO>(`${spotifyApiCallLink}/api/queue`, {
      withCredentials: true,
    });
  }

  public playTrack(deviceId: string): Observable<object> {
    return this.httpClient.post(`${spotifyApiCallLink}/api/current-track/play`, { deviceId }, {
      withCredentials: true,
    },
    );
  }

  public getAvailableDevices(): Observable<Device[]> {
    return this.httpClient.get<Device[]>(`${spotifyApiCallLink}/api/devices`, {
      withCredentials: true,
    });
  }

  public getUserProfile(): Observable<User> {
    return this.httpClient.get<User>(`${spotifyApiCallLink}/api/user`, {
      withCredentials: true,
    });
  }

  public voteTrack(trackUuid: string, userId: string): Observable<object> {
    return this.httpClient.post(`${spotifyApiCallLink}/api/queue/vote`, {
      userId,
      trackUuid,
    },
    {
      withCredentials: true,
    });
  }

  public pauseTrack(): Observable<object> {
    return this.httpClient.put(`${spotifyApiCallLink}/api/current-track/pause`, null, {
      withCredentials: true,
    });
  }

  public isAuthenticated(): Observable<boolean> {
    return this.httpClient.get<boolean>(`${spotifyApiCallLink}/api/authenticated`, {
      withCredentials: true,
    });
  }

  public refresh(): Observable<object> {
    return this.httpClient.post(`${spotifyApiCallLink}/api/auth/refresh`, null, {
      withCredentials: true,
    });
  }
}
