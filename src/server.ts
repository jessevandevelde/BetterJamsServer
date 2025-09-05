import express, { Request, Response } from "express";
import 'dotenv/config'
const { randomBytes } = require('node:crypto');
const { Buffer } = require('node:buffer');
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET; 
const querystring = require('node:querystring'); 
const redirect_uri = 'http://127.0.0.1:3000/callback'; // moet overeenkomen met wat in spotify app settings staat
const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("test");
});
app.get('/login', function(req, res) {

  var state = randomBytes(16).toString('hex');
  var scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: scope,
      redirect_uri,
      state: state
    }));
});
app.get("/spotify/:track", (req: Request, res: Response) => {

  const track = req.params.track;
// input van track die afgespeeld moet worden? (nu dummy data)
  const dummySong = {
    name: track,
    artist: "playboi Dummy",
    url: `https://open.spotify.com/track/dummy-${track}`,
  };

  console.log(`Playing song: ${dummySong.name} by ${dummySong.artist}`);

});
app.get('/callback', async function(req, res) {

  const code = req.query.code as string || null;
  const state = req.query.state as string || null;

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

      const data = await response.json();
      if (data.access_token && data.refresh_token) {
        res.send(`Access token received: ${data.access_token}<br>Refresh token received: ${data.refresh_token}`);
      } else {
        res.send(`Error retrieving tokens: ${JSON.stringify(data)}`);
      }
        } catch (error) {
      res.send(`Error: ${error}`);
    }
  }
});
app.listen(port, () => {
  console.log(`Server draait op http://localhost:${port}`);
});
