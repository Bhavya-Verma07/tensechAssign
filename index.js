const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

// Define the conversion endpoint
app.post("/convert", async (req, res) => {
  const toConvert = req.body.toConvert;

  try {
    const conversions = await Promise.all(
      toConvert.map(async (conversion) => {
        const { amount, from, to } = conversion;
        const exchangeValues = await Promise.all(
          to.map(async (target) => {
            const response = await axios.get(
              `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}/${target}.json`
            );
            const value = response.data[target];
            return { to: target, value };
          })
        );

        return { amount, from, exchangeValues };
      })
    );

    res.json({ conversions });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 7850;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
