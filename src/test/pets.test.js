import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const requester = supertest("http://localhost:8080")

describe('Pets Router Tests', () => {
  let petId;

  describe('GET /api/pets', () => {
    it('should return all pets with status 200', async () => {
      const response = await requester
        .get('/api/pets')
        .expect(200);

      expect(response._body.payload).to.be.an('array');
      expect(response.status).to.equal(200);
    });
  });

  describe('POST /api/pets', () => {
    it('should create a new pet', async () => {
      const newPet = {
        name: "bambam",
        specie: "dog",
        birthDate: "2023-01-23"
      };

      const response = await requester.post("/api/pets").send(newPet)

      expect(response._body.payload).to.have.property('_id');
      expect(response._body.payload.name).to.equal(newPet.name);
      petId = response._body.payload._id;
    });

    it('should fail if required fields are missing', async () => {
      const invalidPet = {
        species: 'Dog'
      };

      const response = await requester
        .post('/api/pets')
        .send(invalidPet)
        .expect(400);
    });
  });

  
  describe('PUT /api/pets/:id', () => {
    it('should update an existing pet', async () => {
      const updateData = {
        name: 'Buddy Updated',
        adopted: true
      };

      const response = await requester
        .put(`/api/pets/${petId}`)
        .send(updateData)

      expect(response._body.status).to.equal("success");
      expect(response._body.message).to.equal("pet updated");
    });
  });

  describe('DELETE /api/pets/:id', () => {
    it('should delete an existing pet', async () => {
      await requester
        .delete(`/api/pets/${petId}`)
        .expect(200);

      await requester
        .get(`/api/pets/${petId}`)
        .expect(404);
    });
  });

  after(async function() {
    await requester.delete(`/api/pets/${petId}`)
})
});
