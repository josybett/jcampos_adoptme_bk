import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const requester = supertest('http://localhost:8080');

describe('Sessions Router Test', () => {
    let cookie;
    let userId;
    
    const mockUser = {
        first_name: "Test",
        last_name: "User",
        email: "testuser@test.com",
        password: "test123456",
        age: 25
    };

    describe('POST /register', () => {
        it('should register a new user successfully', async function() {
            const response = await requester
                .post('/api/sessions/register')
                .send(mockUser);

            userId = response._body.payload;
            expect(response.status).to.equal(200);
        });

        it('should fail registration with missing required fields', async function() {
            const incompleteUser = {
                email: "incomplete@test.com",
                password: "test123456"
            };

            const response = await requester
                .post('/api/sessions/register')
                .send(incompleteUser);

            expect(response.status).to.equal(400);
        });

        it('should not allow duplicate email registration', async function() {
            const response = await requester
                .post('/api/sessions/register')
                .send(mockUser);

            expect(response.status).to.equal(400);
            expect(response._body).to.have.property('error');
        });
    });

    describe('POST /login', () => {
        it('should login successfully with correct credentials', async function() {
            const loginCredentials = {
                email: mockUser.email,
                password: mockUser.password
            };

            const response = await requester
                .post('/api/sessions/login')
                .send(loginCredentials);

            expect(response.status).to.equal(200);
            expect(response.headers['set-cookie']).to.be.an('array');
            cookie = response.headers['set-cookie'][0];
        });

        it('should fail login with incorrect password', async function() {
            const wrongCredentials = {
                email: mockUser.email,
                password: "wrongpassword"
            };

            const response = await requester
                .post('/api/sessions/login')
                .send(wrongCredentials);

            expect(response.status).to.equal(400);
        });

        it('should fail login with non-existent email', async function() {
            const nonExistentUser = {
                email: "nonexistent@test.com",
                password: "test123456"
            };

            const response = await requester
                .post('/api/sessions/login')
                .send(nonExistentUser);

            expect(response.status).to.equal(404);
        });
    });

    describe('GET /current', () => {
        it('should get current user session with valid cookie', async function() {
            const response = await requester
                .get('/api/sessions/current')
                .set('Cookie', cookie);

            expect(response.status).to.equal(200);
            expect(response._body.payload.email).to.equal(mockUser.email);
        });
    });
  
    after(async function() {
        try {
          await requester.delete(`/api/users/${userId}`)
        } catch (error) {
            console.error('Error in test cleanup:', error);
        }
    });
});
