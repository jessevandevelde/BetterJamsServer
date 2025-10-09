export interface ArtistRemote {
  id: string
  name: string
}
export interface AlbumRemote {
  images: { url: string }[]
}

export interface TrackRemote {
  /* eslint-disable @typescript-eslint/naming-convention */
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: { isrc: string, ean: string, upc: string }
  external_urls: { spotify: string }
  href: string
  id: string
  is_playable: boolean
  name: string
  album: AlbumRemote
  artists: ArtistRemote[]
  uri: string
  /* eslint-enable @typescript-eslint/naming-convention */

}

export interface AlbumCoverRemote {
  height: number
  width: number
  url: string
}

export interface SearchResultsRemote {
  tracks: { items: TrackRemote[] }
}
export class Track {
  public albumCoverUrl: string;
  public artists: string;
  public durationMs: number;
  public id: string;
  public name: string;
  public uri: string;

  public constructor(tracksRemote: TrackRemote) {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    const { album, artists, duration_ms, id, name, uri } = tracksRemote;
    const { images } = album;

    this.albumCoverUrl = images[0].url;
    this.artists = artists.map(artist => artist.name).join(', ');
    this.durationMs = duration_ms;
    this.id = id;
    this.name = name;
    this.uri = uri;
  }
}
