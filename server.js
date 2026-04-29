import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// health check (so "/" doesn't show error)
app.get("/", (req, res) => {
  res.send("Proxy is running");
});

app.get("/proxy", async (req, res) => {
  const url = req.query.url;

  if (!url) return res.status(400).send("No URL");

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile Safari/604.1",
        "Accept":
          "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Referer": url,
        "Origin": new URL(url).origin
      },
      redirect: "follow"
    });

    if (!response.ok) {
      return res.status(500).send("Failed to fetch image");
    }

    const buffer = await response.arrayBuffer();

    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.set("Access-Control-Allow-Origin", "*");

    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching image");
  }
});

app.listen(3000, () => {
  console.log("Proxy running");
});
