const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

app.post('/convert', async (req, res) => {
  try {
      const { toConvert } = req.body
      let conversions = []
      for (let t of toConvert) {
          let obj = {}

          let { amount, from, to } = t
          obj.amount = amount
          obj.from = from
          obj.exchangeValues = []

          for (let o of to) {
              const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from.toLowerCase()}/${o.toLowerCase()}.json`
              const response = await axios.get(url)
              const rate = response.data[o.toLowerCase()]
              obj.exchangeValues.push({
                  to: o.toLowerCase(),
                  value: amount * rate,
              })
          }
          conversions.push(obj)
      }
      return res.json({ conversions })
  } catch (error) {
      res.status(500).json({ error: error.message })
  }
})



const PORT = process.env.PORT || 7850;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
