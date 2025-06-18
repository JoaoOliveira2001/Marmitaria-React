import { APPS_SCRIPT_BASE } from "../../src/apiConfig";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const response = await fetch(`${APPS_SCRIPT_BASE}?acao=buscarHorarios`, {
      cache: "no-cache",
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Failed to fetch schedules:", err);
    res.status(500).json({ error: "Failed to fetch schedules", details: err.message });
  }
}
