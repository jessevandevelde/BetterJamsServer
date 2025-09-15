import express, { Request, Response } from "express";
import { randomBytes } from 'node:crypto';
import { Buffer } from 'node:buffer';
import querystring from 'node:querystring';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import dotenvExpand from "dotenv-expand";
import dotenv from "dotenv";
import { createCookie } from "./helpers/cookies.helpers";
import { access } from "node:fs";


const env = dotenv.config();
dotenvExpand.expand(env)
const serverPort = process.env.SERVER_PORT!;
const serverUrl = process.env.SERVER_URL!;
const clientUrl = process.env.CLIENT_URL!;
const spotifyUrl = process.env.SPOTIFY_API_URL!;
const client_id: string = process.env.CLIENT_ID!;
const client_secret: string = process.env.CLIENT_SECRET!;
const redirect_uri = `${serverUrl}/callback`;
const app = express();
app.use(cookieParser());

app.use(cors ({
  origin: clientUrl,
  credentials: true,
}))

app.get("/", (req: Request, res: Response) => {
  res.send("test");
});

app.get('/login', (req: Request, res: Response) => {
  const state = randomBytes(16).toString('hex');
  const scope = 'user-read-private user-read-email';
  const maxAge = 60 * 1000;

  createCookie(res, 'state', state, maxAge)

  res.redirect(`${spotifyUrl}/authorize?` +
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
  const code = req.query.code as string || null;
  const state = req.cookies.state;

  if (state === null || state !== req.query.state) {
    res.redirect(`${clientUrl}/login?error=state_mismatch`);
  } else {

    const params = new URLSearchParams();
    params.append('code', code!);
    params.append('redirect_uri', redirect_uri);
    params.append('grant_type', 'authorization_code');

    try {
      const response = await fetch(`${spotifyUrl}/api/token`, {
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
        const maxAge = 1000 * 60 * 60;

        createCookie(res, 'access_token', data.access_token, maxAge)
        createCookie(res, 'refresh_token', data.refresh_token )
        
        res.redirect(clientUrl);
      } else {
        res.send(`Error retrieving tokens: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      res.send(`Error: ${String(error)}`);
    }
  }
});

app.listen(serverPort, () => {
  console.log(`Server draait op ${serverUrl}`);
});
