import fetch from "node-fetch";

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
  const headers = {
    "User-Agent":
      "Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)",
    Origin: "https://www.instagram.com",
    Referer: "https://www.instagram.com/",
  };

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Instagram profile" });
  }
}
