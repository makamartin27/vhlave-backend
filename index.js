const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: "TVŮJ_API_KLÍČ", // <-- sem vlož svůj klíč
});
const openai = new OpenAIApi(configuration);

app.post("/api/respond", async (req, res) => {
  const userMessage = req.body.message;

  const prompt = `
Představ si, že jsi empatický kamarád, který dobře naslouchá, chápe emoce druhých a snaží se jim lidsky pomoct.
Odpovídáš člověku, který se právě svěřil s tím, co ho trápí.
Odpověď by měla být laskavá, upřímná, lidská a dodat sílu.
Vyhni se odborným nebo chladným výrazům. Mluv jako člověk, ne jako robot.

Uživatel: ${userMessage}
Kamarád:
  `;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Jsi empatický kamarád." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    res.json({ response: completion.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send("Něco se pokazilo.");
  }
});

app.listen(3000, () => {
  console.log("Server běží na http://localhost:3000");
});