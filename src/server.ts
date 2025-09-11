import type { Request, Response } from 'express';
import express from 'express';

const app = express();
const port = 3000;

app.get('/', (_req: Request, res: Response) => {
  res.send('test');
});

app.get('/spotify/:track', (req: Request, _res: Response) => {
  const { track } = req.params;

  // input van track die afgespeeld moet worden? (nu dummy data)
  const dummySong = {
    name: track,
    artist: 'Playboi Dummy',
    url: `https://open.spotify.com/track/dummy-${track}`,
  };

  // eslint-disable-next-line no-console
  console.log(`Playing song: ${dummySong.name} by ${dummySong.artist}`);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server draait op http://localhost:${port}`);
});
