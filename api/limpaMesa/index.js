export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const mesa = String(req.body?.mesa || "").trim();
    const payload = { mesa };

    const url = "https://script.google.com/macros/s/AKfycbxtHy6Vk6CDa3i6HKT6pYpaaVWovvtB8KZt6vdx8um3xLwzTiicHYB2BxdIMhgdt08l/exec";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).send(text);
    }

    res.status(200).send(text);
  } catch (error) {
    console.error("Erro ao limpar mesa:", error);
    res.status(500).json({ error: "Erro interno ao limpar mesa", details: error.message });
  }
}
