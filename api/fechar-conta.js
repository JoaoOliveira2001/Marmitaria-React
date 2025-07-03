export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const mesa = String(req.body?.mesa || "").trim();

    const url =
      "https://script.google.com/macros/s/AKfycbyqxikwY94QYctHheT0-tE36fM_Wd2YUZ4ZJDB-r5Uem5fhwF_mFvpI8qGNJzRMqwnN/exec";

    const payload = { acao: "fecharConta", mesa };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("Erro na resposta do Apps Script:", text);
      return res.status(500).send(text);
    }

    res.status(200).send(text);
  } catch (error) {
    console.error("Erro ao encaminhar fechamento de conta:", error);
    res.status(500).json({ error: "Erro interno ao fechar conta", details: error.message });
  }
}
