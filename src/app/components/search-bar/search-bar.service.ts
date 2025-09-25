import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { spotifyApiCallLink } from 'src/app/environment';

@Injectable({
  providedIn: 'root',
})

export class SearchBarService {
  private readonly httpClient: HttpClient;

  public constructor() {
    this.httpClient = inject(HttpClient);
  }

  public search(query: string): Observable<unknown> {
    return this.httpClient.get(`${spotifyApiCallLink}/search`, {
      params: {
        q: query,
      },
      withCredentials: true,
    });
  }
}
