export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Endpoint that returns occupied tables in the format
    // { success: true, mesas: [1,6] }
    const url =
      "https://script.google.com/macros/s/AKfycbzcncEtTmtS7DrJdfN5dTAaQbNr02ha_Psql6vdlbjOI8gJEM5ioayiKMpRwUxzzHd_/exec";

    const response = await fetch(url);
    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).send(text);
    }

    const data = JSON.parse(text);
    // Return only the array of mesas so the frontend receives [1,6]
    res.status(200).json(data.mesas || data);
  } catch (error) {
    console.error("Erro ao obter status das mesas:", error);
    res
      .status(500)
      .json({ error: "Erro interno ao obter mesas", details: error.message });
  }
}
