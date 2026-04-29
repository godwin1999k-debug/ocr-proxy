import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/proxy", async (req, res) => {
  const url = req.query.url;

  if (!url) return res.status(400).send("No URL");

  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    res.set("Content-Type", response.headers.get("content-type"));
    res.send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).send("Error fetching image");
  }
});

app.listen(3000, () => console.log("Proxy running"));
