import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import spotifyRoutes from "./routes/spotify.js";
import { getSpotifyAccessToken } from "./utils/spotifyAuth.js";

// Load env variables
dotenv.config();

// Try fetching the Spotify token on startup for debugging
// getSpotifyAccessToken()
//   .then((token) => {
//     console.log("🎧 Token fetched successfully in index.ts:");
//     console.log("ACCESS_TOKEN:", token);
//   })
//   .catch((err) => {
//     console.error("🔥 Token call failed in index.ts:");
//     if (err instanceof Error) {
//       console.error("Message:", err.message);
//     } else {
//       console.error("Unknown error:", err);
//     }
//     console.dir(err, { depth: null });
//   });

// Global error fallback
process.on("unhandledRejection", (reason, promise) => {
  console.error("🛑 Unhandled Promise Rejection:");
  console.dir(reason, { depth: null });
});

const app = express();
app.use(cors());
app.use(express.json());

// Mount Spotify API routes
app.use("/api/spotify", spotifyRoutes);

// Handle Spotify OAuth callback
app.get("/api/callback", (req, res) => {
  const code = req.query.code;
  if (!code) {
    res.status(400).send("Missing authorization code.");
    return;
  }

  console.log("🟢 Received authorization code:", code);
  res.send("✅ Authorization code received! You can now exchange it for a token.");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
