const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const request = require("request")
const {getData, generateCSV} = require("./export")

const app = express()

app.use(bodyParser.json({limit: "10mb"}))

app.get("/investments/:id", (req, res) => {
  const {id} = req.params
  request.get(`${config.investmentsServiceUrl}/investments/${id}`, (e, r, investments) => {
    if (e) {
      console.error(e)
      res.send(500)
    } else {
      res.send(investments)
    }
  })
})

app.get("/export", async (req, res) => {
  try {
    const exportData = await getData()
    const csvData = generateCSV(exportData)
    res.type("text/csv")
    res.attachment("all-investments.csv").send(csvData)
  } catch (e) {
    console.error(e)
    res.send(500)
  }
})

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err)
    process.exit(1)
  }
  console.log(`Server running on port ${config.port}`)
})
