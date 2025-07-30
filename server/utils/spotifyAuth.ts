import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const {
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REFRESH_TOKEN,
} = process.env;

console.log("📦 ENV VARS LOADED:");
console.log("SPOTIFY_CLIENT_ID:", SPOTIFY_CLIENT_ID);
console.log("SPOTIFY_CLIENT_SECRET:", SPOTIFY_CLIENT_SECRET ? "✅ Present" : "❌ Missing");
console.log("SPOTIFY_REFRESH_TOKEN:", SPOTIFY_REFRESH_TOKEN ? "✅ Present" : "❌ Missing");

export async function getSpotifyAccessToken(): Promise<string> {
    console.log("🟢 Starting getSpotifyAccessToken");

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
        throw new Error("❌ Missing Spotify credentials in .env");
    }

    const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");

    try {
        const res = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: SPOTIFY_REFRESH_TOKEN,
            }),
        });

        console.log("📨 Spotify response status:", res.status);

        const json = await res.json() as { access_token?: string; error?: { message?: string } };
        console.log("📦 Full Spotify JSON response:", json);

        if (!res.ok) {
            throw new Error(`Spotify API error: ${json.error?.message || "Unknown error"}`);
        }

        if (!json.access_token) {
            throw new Error("Spotify response missing access_token");
        }

        console.log("🎉 Received access token successfully");
        return json.access_token;
    } catch (err) {
        console.error("❌ Fatal error during token fetch:");
        if (err instanceof Error) {
            console.error("Message:", err.message);
        } else {
            console.error("Unknown error:", err);
        }
        console.dir(err, { depth: null });
        throw err;
    }
}
