import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';
import { spotifyApiCallLink } from 'src/app/environment';
import { Track } from '../components/search-bar/search-bar.interfaces';
import type { SearchResultsRemote } from '../components/search-bar/search-bar.interfaces';

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
        query: query,
      },
      withCredentials: true,
    }).pipe(
      map((searchResultsRemote) => {
        return searchResultsRemote.tracks.items.map(trackRemote => new Track(trackRemote));
      }),
    );
  }
}
