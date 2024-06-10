const {expect} = require("chai")
const sinon = require("sinon")
const {getData, generateCSV} = require("../src/exportLogic")
const config = require("../config/default.json")
const axios = require("axios")

describe("exportLogic", () => {
  afterEach(() => {
    sinon.restore()
  })

  describe("getData", () => {
    it("should fetch investments and companies data", async () => {
      const investmentsResp = {data: [{id: 1, name: "Investment foo"}]}
      const companiesResp = {data: [{id: 1, name: "Company Bar"}]}

      sinon.stub(axios, "get")
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
            id: 1,
            userId: 1,
            firstName: "Foo",
            lastName: "Bar",
            date: "2024-01-01",
            holdings: [{id: 1, investmentPercentage: 0.5}],
            investmentTotal: 1000,
          },
        ],
        companies: [{id: 1, name: "Xyz"}, {id: 2, name: "Abc"}],
      }
      const expectedCSV = "\"User\",\"First Name\",\"Last Name\",\"Date\",\"Holding\",\"Value\"\n1,\"Foo\",\"Bar\",\"2024-01-01\",\"Xyz\",500"

      const csv = generateCSV(mockData)
      expect(csv).to.equal(expectedCSV)
    })
  })
})
