import express, { Request, Response } from "express";
import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import { Buffer } from 'node:buffer';
import querystring from 'node:querystring';
import cookieParser from 'cookie-parser';
import cors from 'cors'

const client_id: string = process.env.CLIENT_ID!;
const client_secret: string = process.env.CLIENT_SECRET!;
const redirect_uri = 'http://127.0.0.1:3000/callback';
const app = express();
app.use(cookieParser());
const port = 3000;
app.use(cors ({
  origin: 'http://127.0.0.1:4200',
  credentials: true,
}))

app.get("/", (req: Request, res: Response) => {
  res.send("test");
});

app.get('/login', (req: Request, res: Response) => {
  const state = randomBytes(16).toString('hex');
  const scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state
    }));
});

app.get("/track", (req: Request, res: Response) => {
  const track = req.params.track;
  const dummySong = {
    name: track,
    artist: "playboi Dummy",
    url: `https://open.spotify.com/track/dummy-${track}`,
  };
  console.log(req.cookies)
  console.log(`Playing song: ${dummySong.name} by ${dummySong.artist}`);
  res.json(dummySong);
});

app.get('/callback', async (req: Request, res: Response) => {
  const code = typeof req.query.code === 'string' ? req.query.code : null;
  const state = typeof req.query.state === 'string' ? req.query.state : null;

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    const params = new URLSearchParams();
    params.append('code', code!);
    params.append('redirect_uri', redirect_uri);
    params.append('grant_type', 'authorization_code');
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
        },
        body: params.toString()
      });

      const data: {
        access_token?: string;
        refresh_token?: string;
        [key: string]: unknown;
      } = await response.json();

      if (data.access_token && data.refresh_token) {
        res.cookie('access_token', data.access_token, { httpOnly: true, secure: false, sameSite: 'lax' });
        res.cookie('refresh_token', data.refresh_token , { httpOnly: true, secure: false, sameSite: 'lax' });
        res.redirect('http://127.0.0.1:4200');
      } else {
        res.send(`Error retrieving tokens: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      res.send(`Error: ${String(error)}`);
    }
  }
});

app.listen(port, () => {
  console.log(`Server draait op http://localhost:${port}`);
});
