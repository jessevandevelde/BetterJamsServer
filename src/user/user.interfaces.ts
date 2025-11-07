export interface UserRemote {
  /* eslint-disable @typescript-eslint/naming-convention */
  country: string
  display_name: string
  email: string
  explicit_content: {
    filter_enabled: boolean
    filter_locked: boolean
  }
  followers: {
    href: null
    total: number
  }
  href: string
  id: string
  images: [
    {
      height: number
      url: string
      width: number
    },
    {
      height: number
      url: string
      width: number
    },
  ]

  external_urls: {
    spotify: string
  }

  product: string
  type: string
  uri: string
  /* eslint-enable @typescript-eslint/naming-convention */
}

export class User {
  public image: string;
  public accountUrl: string;
  public userId: string;

  public constructor(userRemote: UserRemote) {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    const { images, external_urls, id } = userRemote;

    this.image = images[0].url;
    this.accountUrl = external_urls.spotify;
    this.userId = id;
  }
}
