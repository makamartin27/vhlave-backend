const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
    const completion = await openai.chat.completions.create({
      model:"gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Jsi empatický kamarád." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 300
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send("Něco se pokazilo.");
  }
});

app.listen(3000, () => {
  console.log("Server běží na http://localhost:3000");
});
