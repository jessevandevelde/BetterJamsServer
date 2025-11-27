import type { Track } from './queue.interfaces';

export class FallbackTrackPlaylist {
  public readonly fallbackPlaylist = new Map<string, Track>();

  public getRandomTrack(): Track {
    const playlistArray = [...this.fallbackPlaylist.values()];

    const randomTrackIndex = Math.floor(Math.random() * this.fallbackPlaylist.size);

    console.log(playlistArray, randomTrackIndex, this.fallbackPlaylist.size, playlistArray[randomTrackIndex]);

    return playlistArray[randomTrackIndex];
  }

  public addTrackToPlaylist(track: Track): void {
    const x = this.fallbackPlaylist.has(track.id);

    if (x) {
      return;
    }

    this.fallbackPlaylist.set(track.id, track);
  }
}

const playlist = new FallbackTrackPlaylist();

export function getFallbackPlaylist(): FallbackTrackPlaylist {
  return playlist;
}
