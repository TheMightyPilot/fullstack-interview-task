const chai = require("chai")
const chaiHttp = require("chai-http")
const sinon = require("sinon")
const app = require("../src/index")
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

    const getDataStub = sinon.stub(exportLogic, "getData").resolves(mockData)
    const generateCSVStub = sinon.stub(exportLogic, "generateCSV").returns(mockCSV)

    const res = await chai.request(app).get("/export")

    // Check that the stubs were called
    expect(getDataStub.calledOnce).to.be.true
    expect(generateCSVStub.calledOnce).to.be.true

    expect(res).to.have.status(200)
    expect(res).to.have.header("content-type", "text/csv; charset=utf-8")
    expect(res).to.have.header("content-disposition", "attachment; filename=\"all-investments.csv\"")
    expect(res.text).to.equal(mockCSV)
  })

  it("should return error code 500 on an issue generating csv", async () => {
    const mockData = [{foo: "abc", bar: "xyz"}]

    sinon.stub(exportLogic, "getData").resolves(mockData)
    sinon.stub(exportLogic, "generateCSV").throws("Error")

    const res = await chai.request(app).get("/export")
    expect(res).to.have.status(500)
  })
})
