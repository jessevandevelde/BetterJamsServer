export interface Track {
  albumCoverUrl: string
  artists: string
  durationMs: number
  id: string
  name: string
  uri: string
}

export class QueueTrack implements Track {
  public upvoteIds: string[];
  public albumCoverUrl: string;
  public artists: string;
  public durationMs: number;
  public id: string;
  public name: string;
  public uri: string;
  public dateAdded: string;
  public uuid: string;

  public constructor(track: Track) {
    const { albumCoverUrl, artists, durationMs, id, name, uri } = track;

    this.albumCoverUrl = albumCoverUrl;
    this.artists = artists;
    this.durationMs = durationMs;
    this.id = id;
    this.name = name;
    this.uri = uri;
    this.upvoteIds = [];
    this.dateAdded = Date.now().toLocaleString();
    this.uuid = crypto.randomUUID();
  }
}
