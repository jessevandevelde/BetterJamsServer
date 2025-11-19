export interface SpotifyDevice {
  /* eslint-disable @typescript-eslint/naming-convention */
  id: string
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  type: string
  volume_percent: number
  /* eslint-enable @typescript-eslint/naming-convention */
}

export interface DevicesResponse {
  devices: SpotifyDevice[]
}
