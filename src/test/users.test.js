import chai from 'chai';
import supertest from 'supertest';
import { expect } from 'chai';

const requester = supertest('http://localhost:8080');

describe('Users Router Test', () => {
    let userId;
    
    before(async function() {
        const mockUser = {
            first_name: "Test",
            last_name: "User",
            email: "testuser@test.com",
            password: "test123456"
        };
        const registerResponse = await requester.post("/api/sessions/register").send(mockUser)
        userId = registerResponse._body.payload
    })

    describe('GET /', () => {
        it('should get all users', async function() {
            const response = await requester.get('/api/users');
            
            expect(response.status).to.equal(200);
            expect(response._body.payload).to.be.an('array');
        });
    });

    describe('GET /:uid', () => {
        it('should get a specific user by ID', async function() {
            const response = await requester.get(`/api/users/${userId}`);
            
            expect(response.status).to.equal(200);
            expect(response._body.payload).to.have.property('_id');
        });

        it('should return error for non-existent user ID', async function() {
            const nonExistentId = '507f1f77bcf86cd799439011';
            const response = await requester.get(`/api/users/${nonExistentId}`);
            
            expect(response.status).to.equal(404);
        });
    });

    describe('PUT /:uid', () => {
        it('should update a user', async function() {
            const updateData = {
                first_name: "Updated",
                last_name: "User"
            };

            const response = await requester
                .put(`/api/users/${userId}`)
                .send(updateData);

            expect(response.status).to.equal(200);
            expect(response._body.payload.first_name).to.equal(updateData.first_name);
        });
    });

    describe('PUT /:uid/documents', () => {
        it('should handle document upload errors', async function() {
            const response = await requester
                .put(`/api/users/${userId}/documents`);

            expect(response.status).to.equal(400);
        });
    });

    after(async function() {
        try {
            await requester.get(`/api/users/${userId}`)
            await requester.close();
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    });
});
