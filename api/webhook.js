export default async function handler(req, res) {
  // Dropbox sends a GET request with a challenge param to verify the webhook
  if (req.method === "GET") {
    const challenge = req.query.challenge;
    if (challenge) {
      return res.status(200).send(challenge);
    }
    return res.status(200).send("OK");
  }

  // Dropbox sends a POST request when a file changes
  if (req.method === "POST") {
    console.log("Dropbox change detected, triggering GitHub Action...");

    const response = await fetch(
      "https://api.github.com/repos/ndcffd7yvh-commits/work-calendar/actions/workflows/update-calendar.yml/dispatches",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ref: "main" }),
      }
    );

    if (response.ok || response.status === 204) {
      console.log("GitHub Action triggered successfully");
      return res.status(200).json({ ok: true });
    } else {
      const text = await response.text();
      console.error("Failed to trigger GitHub Action:", text);
      return res.status(500).json({ error: text });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
