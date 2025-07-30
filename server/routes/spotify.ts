import express from "express";
import type { Request, Response } from "express";
import fetch from "node-fetch";
import { getSpotifyAccessToken } from "../utils/spotifyAuth.js";

const router: express.Router = express.Router();

router.get("/top-tracks", async (_req: Request, res: Response) => {
    try {
        const accessToken = await getSpotifyAccessToken();

        const response = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=5", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Spotify API Error:", errorBody);
            res.status(response.status).json({ error: "Failed to fetch top tracks from Spotify" });
            return;
        }

        const data = await response.json() as { items: any[] };
        res.json(data);
    } catch (error) {
        console.error("Internal Spotify error:", JSON.stringify(error, null, 2));
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
