const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { google } = require("googleapis");

// Usa as credenciais do ambiente da Railway
const keys = JSON.parse(process.env.CREDENTIALS_JSON);

const app = express();

// CORS: libera Vercel
app.use(cors({
  origin: "https://marmitaria-react.vercel.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// Para garantir resposta ao preflight CORS
app.options("*", cors());

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

    const {
      nome,
      telefone,
      produtos,
      quantidade,
      total,
      pagamento,
      status
    } = req.body;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Pedidos!A1",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[
          new Date().toLocaleString("pt-BR"),
          nome,
          telefone,
          produtos,
          quantidade,
          total,
          pagamento,
          status
        ]]
      }
    });

    res.status(200).send("Pedido salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    res.status(500).send("Erro ao salvar pedido");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
