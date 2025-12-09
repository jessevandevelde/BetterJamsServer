export interface SpotifyDevice {
  /* eslint-disable @typescript-eslint/naming-convention */
  id: string | null
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  type: string
  volume_percent: number | null
  /* eslint-enable @typescript-eslint/naming-convention */
}

export interface DevicesResponse {
  devices: SpotifyDevice[]
}

export class Device {
  public id: string | null;
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  public is_active: boolean;
  public name: string;
  public type: string;

  public constructor(spotifyDevice: SpotifyDevice) {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    const { id, is_active, name, type } = spotifyDevice;

    this.id = id;
    this.is_active = is_active;
    this.name = name;
    this.type = type;
  }
}
