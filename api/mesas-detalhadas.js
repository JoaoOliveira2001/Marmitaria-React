const APPS_SCRIPT_BASE =
  "https://script.google.com/macros/s/AKfycbxIcGhc0fURMzbTv5sRf5uNyQ7iLKcQ_D7JTYCyfwCY-QWGf8T3FeuJLe0KwnkJtVuH/exec";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const response = await fetch(`${APPS_SCRIPT_BASE}?acao=buscarMesasDetalhadas`, {
      cache: "no-cache",
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Failed to fetch table details:", err);
    res.status(500).json({ error: "Failed to fetch table details", details: err.message });
  }
}
