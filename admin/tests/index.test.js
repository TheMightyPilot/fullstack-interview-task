const chai = require("chai")
const chaiHttp = require("chai-http")
const sinon = require("sinon")
const exportLogic = require("../src/exportLogic")
const {expect} = chai

chai.use(chaiHttp)

describe("GET /export", () => {
  afterEach(() => {
    sinon.restore()
  })

  it("should return CSV with correct content", async () => {
    const mockData = [{foo: "abc", bar: "xyz"}]
    const mockCSV = "foo,bar\nabc,xyz"

    sinon.stub(exportLogic, "getData").resolves(mockData)
    sinon.stub(exportLogic, "generateCSV").returns(mockCSV)

    const app = require("../src/index") // Not sure what is going on here, I need to require the app here in order for this test to work
    // appears to be an issue with sinon unable to properly stub the functions from exportLogic
    const res = await chai.request(app).get("/export")

    expect(res).to.have.status(200)
    expect(res).to.have.header("content-type", "text/csv; charset=utf-8")
    expect(res).to.have.header("content-disposition", "attachment; filename=\"all-investments.csv\"")
    expect(res.text).to.equal(mockCSV)
  })

  it("should return error code 500 on an issue generating csv", async () => {
    const mockData = [{foo: "abc", bar: "xyz"}]

    sinon.stub(exportLogic, "getData").resolves(mockData)
    sinon.stub(exportLogic, "generateCSV").throws("Error")

    const app = require("../src/index") // Not sure what is going on here, I need to require the app here in order for this test to work
    // appears to be an issue with sinon unable to properly stub the functions from exportLogic

    const res = await chai.request(app).get("/export")
    expect(res).to.have.status(500)
  })
})
