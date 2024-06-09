const {expect} = require("chai")
const sinon = require("sinon")
const {getData, generateCSV} = require("../src/exportLogic")
const config = require("../config/default.json")
const axios = require("axios")

describe("exportLogic", () => {
  describe("getData", () => {
    it.only("should fetch investments and companies data", async () => {
      // Mock axios.get to return fake data
      const investmentsResp = {data: [{id: 1, name: "Investment 1"}]}
      const companiesResp = {data: [{id: 1, name: "Company 1"}]}
      sinon.stub(axios, "get").resolves({})

      axios.get.withArgs(`${config.investmentsServiceUrl}/investments`).resolves(investmentsResp)
      axios.get.withArgs(`${config.financialCompaniesServiceUrl}/companies`).resolves(companiesResp)

      const data = await getData()
      expect(data).to.deep.equal({
        investments: investmentsResp.data,
        companies: companiesResp.data,
      })
    })
  })

  describe("generateCSV", () => {
    it("should generate CSV string from investments and companies data", () => {
      const mockData = {
        investments: [
          {
            userId: 1,
            firstName: "John",
            lastName: "Doe",
            date: "2022-06-09",
            holdings: [{id: 1, investmentPercentage: 0.5}],
            investmentTotal: 1000,
          },
        ],
        companies: [{id: 1, name: "Company 1"}],
      }
      const expectedCSV = "User,First Name,Last Name,Date,Holding,Value\n1,John,Doe,2022-06-09,Company 1,500\n"

      const csv = generateCSV(mockData)
      expect(csv).to.equal(expectedCSV)
    })
  })
})
