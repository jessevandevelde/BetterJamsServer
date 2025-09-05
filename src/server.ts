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
app.get('/callback', function(req, res) {

  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };
  }
});
app.listen(port, () => {
  console.log(`Server draait op http://localhost:${port}`);
});
