// api/enviar-pedido.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const pedido = req.body;

    const url = "https://script.google.com/macros/s/AKfycbxCyDQIfz7-x-YP2paxUgKEF41Txa25PKYvbqE-DwenDqMELm7mCoe5Jd51iDk1LiDu/exec";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedido),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("Erro na resposta do Apps Script:", text);
      return res.status(500).json({
        error: "Erro ao enviar para a planilha",
        details: text,
      });
    }

    res.status(200).json({ message: "Pedido enviado com sucesso" });

  } catch (error) {
    console.error("Erro interno ao enviar pedido:", error);
    res.status(500).json({ error: "Erro interno ao enviar pedido", details: error.message });
  }
}
