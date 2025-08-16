import express from "express";
import spotifyRouter from "./server/src/api/spotify.js"; // adjust if you're using TypeScript

const app = express();

app.use("/api/spotify", spotifyRouter);

app.listen(3001, () => console.log("Server listening on http://localhost:3001"));
