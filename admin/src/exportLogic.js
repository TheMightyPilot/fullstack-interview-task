const axios = require("axios")
const config = require("config")
const {StreamParser} = require("@json2csv/plainjs")

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
  const options = {
    fields: [
      {
        value: "user",
        label: "User",
      },
      {
        value: "firstName",
        label: "First Name",
      },
      {
        value: "lastName",
        label: "Last Name",
      },
      {
        value: "date",
        label: "Date",
      },
      {
        value: "holding",
        label: "Holding",
      },
      {
        value: "value",
        label: "Value",
      },
    ],
  }

  const parser = new StreamParser(options)

  let csv = ""
  parser.onData = (chunk) => (csv += chunk.toString())
  parser.onError = (err) => {
    throw err
  }

  investments.forEach((investment) => {
    const {
      userId,
      firstName,
      lastName,
      date,
      holdings,
      investmentTotal,
    } = investment

    holdings.forEach((holding) => {
      const holdingCompany = companies.find((company) => company.id === holding.id)
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

  return csv
}

module.exports = {
  getData,
  generateCSV,
}
