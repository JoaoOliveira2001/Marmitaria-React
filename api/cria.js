export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const data = req.body;

    const url = "https://script.google.com/macros/s/AKfycbzF9SaWpbP1Bh_m93nei2I-3XP3ajiP-w5pgmKud1pCcDU2so9L98z49FpHvh0sqgrn/exec";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).send(text);
    }

    res.status(200).send(text);
  } catch (error) {
    console.error("Erro ao encaminhar dados:", error);
    res.status(500).json({ error: "Erro interno ao enviar dados", details: error.message });
  }
}
