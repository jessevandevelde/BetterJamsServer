import type { Track } from './queue.interfaces';

export class FallbackTrackPlaylist {
  public readonly fallbackPlaylist = new Map<string, Track>();

  public getRandomTrack(): Track {
    const playlistArray = [...this.fallbackPlaylist.values()];

    const randomTrackIndex = Math.floor(Math.random() * this.fallbackPlaylist.size);

    return playlistArray[randomTrackIndex];
  }

  public addTrackToPlaylist(track: Track): void {
    const hasTrack = this.fallbackPlaylist.has(track.id);

    if (hasTrack) {
      return;
    }

    this.fallbackPlaylist.set(track.id, track);
  }
}

const playlist = new FallbackTrackPlaylist();

export function getFallbackPlaylist(): FallbackTrackPlaylist {
  return playlist;
}
