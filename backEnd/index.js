const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const fs = require("fs");

let keys;
if (process.env.CREDENTIALS_JSON) {
  keys = JSON.parse(process.env.CREDENTIALS_JSON);
} else {
  keys = JSON.parse(fs.readFileSync("credentials.json", "utf8"));
}

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://marmitaria-react.vercel.app"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("/enviar-pedido", cors());


app.use(bodyParser.json());

const auth = new google.auth.GoogleAuth({
  credentials: keys,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

app.post("/enviar-pedido", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });
    const id = Math.random().toString(36).substr(2, 9).toUpperCase();
    const dataAtual = new Date().toLocaleString("pt-BR");

    const spreadsheetId = "1jCpEFIits62fOS4aAdrzKwnx7Zj193eJn8aRCar6Lnc";

    const {
      nome,
      telefone,
      endereco,
      produtos,
      quantidade,
      total,
      pagamento,
      status,
      observacoes
    } = req.body;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Pedidos!A1",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[
          id,
          dataAtual,
          nome,
          telefone,
          endereco,
          produtos,
          quantidade,
          total,
          pagamento,
          status,
          observacoes
        ]],
      },
    });

    res.send("Pedido salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    res.status(500).send("Erro ao salvar pedido");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
