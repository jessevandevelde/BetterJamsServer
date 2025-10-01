import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { spotifyApiCallLink } from 'src/app/environment';
import type { Track } from './search-bar.interfaces';

@Injectable({
  providedIn: 'root',
})

export class SearchBarService {
  private readonly httpClient: HttpClient;

  public constructor() {
    this.httpClient = inject(HttpClient);
  }

  public search(query: string): Observable<Track[]> {
    return this.httpClient.get<Track[]>(`${spotifyApiCallLink}/search`, {
      params: {
        q: query,
      },
      withCredentials: true,
    });
  }
}
