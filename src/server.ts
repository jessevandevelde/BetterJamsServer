import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("test");
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

app.listen(port, () => {
  console.log(`Server draait op http://localhost:${port}`);
});
