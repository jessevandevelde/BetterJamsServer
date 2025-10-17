import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';
import { spotifyApiCallLink } from 'src/app/environment';
import { Track } from '../types/track.interfaces';
import type { SearchResultsRemote } from '../types/track.interfaces';

@Injectable({
  providedIn: 'root',
})

export class RoomPageService {
  private readonly httpClient: HttpClient;

  public constructor() {
    this.httpClient = inject(HttpClient);
  }

  public search(query: string): Observable<Track[]> {
    return this.httpClient.get<SearchResultsRemote>(`${spotifyApiCallLink}/search`, {
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

  public postSong(track: Track): Observable<Track> {
    return this.httpClient.post<Track>(`${spotifyApiCallLink}/queue`, track, {
      withCredentials: true,
      params: {
        check: true,
      },
    });
  }
}
