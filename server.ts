import express, { Request, Response } from "express";
import request from "request";
import { PassThrough } from "stream";
import cloudinary from "cloudinary";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.get("/video", (req: Request, res: Response) => {
  const videoId: any = process.env.CLOUDINARY_VIDEO;
  const format = "mp4";
  const cloudinaryStream = cloudinary.v2.video(videoId, {
    resource_type: "video",
    format: format,
    streaming_profile: "hd",
  });

  const passThroughStream = new PassThrough();

  res.writeHead(200, {
    "Content-Type": `video/${format}`,
    "Content-Disposition": "inline",
  });

  cloudinaryStream.on("error", (err: Error) => {
    console.log("Erro captuado:", err);
    passThroughStream.destroy(err);
  });

  passThroughStream.on("error", (err: Error) => {
    console.log("Erro no front", err);
  });

  passThroughStream.on("close", () => {
    console.log("Vídeo concluído");
  });

  passThroughStream.pipe(res);
  request
    .get(cloudinaryStream)
    .pipe(passThroughStream as unknown as NodeJS.WritableStream);
});

app.listen(3000, () => {
  console.log("Running in 3000");
});
