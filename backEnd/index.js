const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const keys = require("./credentials.json");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const auth = new google.auth.GoogleAuth({
  credentials: keys,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

app.post("/enviar-pedido", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1jCpEFIits62fOS4aAdrzKwnx7Zj193eJn8aRCar6Lnc";

    const { nome, telefone, produto, quantidade, total, pagamento, status } = req.body;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Pedidos!A1", // A aba da planilha precisa se chamar "Pedidos"
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[new Date().toLocaleString(), nome, telefone, produto, quantidade, total, pagamento, status]],
      },
    });

    res.send("Pedido salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    res.status(500).send("Erro ao salvar pedido");
  }
});

app.listen(3001, () => console.log("Servidor backend rodando em http://localhost:3001"));
