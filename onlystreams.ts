import express, { Request, Response } from "express";
import fs from "fs";
const app = express();

app.get("/video", (req: Request, res: Response) => {
  const range = req.headers?.range;
  const videoPath = "./teste.mp4";
  const videoSize = fs.statSync(videoPath).size;

  //quantidade em bytes
  const CHUNK_SIZE = 1 * 1e6;
  const start = range ? Number(range?.replace(/\D/g, "")) : Number("");
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;

  const headers = {
    "Content-range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);

  const stream = fs.createReadStream(videoPath, { start, end });
  stream.pipe(res);
});

app.listen(3000, () => {
  console.log("running in 3000");
});
