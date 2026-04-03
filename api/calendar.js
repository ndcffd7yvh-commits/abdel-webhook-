export default async function handler(req, res) {
  const token = req.query.token;

  if (!token || token !== process.env.CALENDAR_TOKEN) {
    return res.status(401).send("Unauthorized");
  }

  const response = await fetch(
    "https://raw.githubusercontent.com/ndcffd7yvh-commits/work-calendar/main/output/abdel.ics"
  );

  if (!response.ok) {
    return res.status(500).send("Failed to fetch calendar");
  }

  const ics = await response.text();

  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  return res.status(200).send(ics);
}
