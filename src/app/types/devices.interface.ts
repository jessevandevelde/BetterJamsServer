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
