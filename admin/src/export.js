const axios = require("axios")
const config = require("config")
const {StreamParser} = require("@json2csv/plainjs")
const {flatten} = require("@json2csv/transforms")

function getData() {
  const getInvestments = axios.get(`${config.investmentsServiceUrl}/investments`)
  const getCompanies = axios.get(`${config.financialCompaniesServiceUrl}/companies`)

  return Promise.all([getInvestments, getCompanies])
    .then(([investmentsResp, companiesResp]) => {
      return {
        investments: investmentsResp.data,
        companies: companiesResp.data,
      }
    })
}

function generateCSV(data) {
  const {investments, companies} = data
  const options = {}

  const parser = new StreamParser(options)

  let csv = ""
  parser.onData = (chunk) => (csv += chunk.toString())
  parser.onEnd = () => console.log(csv)
  parser.onError = (err) => console.error(err)

  parser.onHeader = (header) => console.log(header)
  parser.onLine = (line) => console.log(line)

  investments.forEach((investment) => {
    const {userId, firstName, lastName, date, holdings, investmentTotal} = investment
    investment.holdings.forEach((holding) => {
      const holdingCompany = companies.find((company) => company.id = holding.id)
      const currentLine = {
        user: userId,
        firstName,
        lastName,
        date,
        holding: holdingCompany.name,
        value: investmentTotal * holding.investmentPercentage,
      }
      parser.pushLine(currentLine)
    })
  })
}

exports.getData = getData
exports.generateCSV = generateCSV
