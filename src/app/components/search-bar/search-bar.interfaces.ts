export interface Artist {
  name: string
}

export interface Image {
  url: string
}

export interface Album {
  images: Image[]

}

export interface Track {
  album: Album
  artists: Artist[]
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  duration_ms: number
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export interface SearchTracksInterface {
  albumCoverUrl: string
  trackName: string
  artistName: string
}
