import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const requester = supertest("http://localhost:8080")

describe("Testing Adoption Endpoints", () => {
    let userCookie;
    let petId;
    let userId;

    before(async function() {
      // Create user
        const mockUser = {
            first_name: "Test",
            last_name: "User",
            email: "test@adoption.com",
            password: "test123456"
        }
        const registerResponse = await requester.post("/api/sessions/register").send(mockUser)
        userId = registerResponse._body.payload

        // Login to get cookie
        const loginResponse = await requester.post("/api/sessions/login")
            .send({ email: mockUser.email, password: mockUser.password })
        
        const cookieResult = loginResponse.headers["set-cookie"][0]
        userCookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1]
        }

        // Create a test pet
        const petMock = {
            name: "TestPet",
            specie: "dog",
            birthDate: "2022-10-10"
        }
        const petResponse = await requester.post("/api/pets").send(petMock)
        petId = petResponse._body.payload._id
    })

    describe("POST /api/adoptions", () => {
      let adoptionId = ''
        it("Should create a new adoption successfully", async () => {
            const { statusCode, _body } = await requester
                .post(`/api/adoptions/${userId}/${petId}`)
                .set("Cookie", [`${userCookie.name}=${userCookie.value}`])
                adoptionId = _body.payload
            expect(statusCode).to.equal(200)
            expect(_body).to.have.property("status", "success")
        })

        it("Should fail when trying to adopt without authentication", async () => {
            const { statusCode, _body } = await requester.post(`/api/adoptions/${userId}/${petId}`)

            expect(statusCode).to.equal(400)
            expect(_body.error).to.equal("Pet is already adopted")
        })

        it("Should get adoption by ID", async () => {
          const { statusCode, _body } = await requester
              .get(`/api/adoptions/${adoptionId}`)
              .set("Cookie", [`${userCookie.name}=${userCookie.value}`])

          expect(statusCode).to.equal(200)
          expect(_body.payload).to.have.property("_id", adoptionId)
      })
    })

    describe("GET /api/adoptions", () => {
        it("Should get all adoptions", async () => {
            const { statusCode, _body } = await requester
                .get("/api/adoptions")
                .set("Cookie", [`${userCookie.name}=${userCookie.value}`])

            expect(statusCode).to.equal(200)
            expect(_body.payload).to.be.an('array')
        })
    })


    after(async function() {
        await requester.delete(`/api/users/${userId}`)
        await requester.delete(`/api/pets/${petId}`)
    })
})
