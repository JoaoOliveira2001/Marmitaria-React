export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const mesa = String(req.body?.mesa || "").trim();
    const payload = { acao: "limparMesa", mesa };

    const url =
      "https://script.google.com/macros/s/AKfycbw3q0WCN1EO2A6bS5no9-71AutpAOLpS6L1yNFxetwGcNxdd-Fx92vPZpzRxKwSCT1g/exec";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).send(text);
    }

    try {
      res.status(200).json(JSON.parse(text));
    } catch {
      res.status(200).send(text);
    }
  } catch (error) {
    console.error("Erro ao limpar mesa:", error);
    res.status(500).json({ error: "Erro interno ao limpar mesa", details: error.message });
  }
}
