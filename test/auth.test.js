const supertest = require('supertest');
const app = require('../app');
const { connect } = require('./database');
const UserModel = require('../models/user');

// Test suite
describe('Authentication Tests', () => {
    let connection
    // before hook
    beforeAll(async () => {
        connection = await connect()
    })

    afterEach(async () => {
        await connection.cleanup()
    })
    
    // after hook
    afterAll(async () => {
        await connection.disconnect()
    })


    // Test case
    it('should successfully register a user', async () => {
        const response = await supertest(app)
        .post('/users/signup')
        .type('form')
        .send({
            email: "maito4me@example.com",
            first_name: "Sulaimon",
            last_name: "Rasheed",
            password: "altschool123",
            
        })

        expect(response.status).toEqual(302);
        expect(response.header.location).toBe("/login") 
    })

    // Test case
    it('should successfully login a user', async () => {
        await UserModel.create({
            email: "maito4me@example.com",
            first_name: "Sulaimon",
            last_name: "Rasheed",
            password: "altschool123",
            
        });

        const response = await supertest(app)
        .post('/users/login')
        .type('form')
        .send({
            email: "maito4me@example.com",
            password: "altschool123"
        })

        expect(response.status).toEqual(302)
        
        expect(response.header.location).toBe("/dashboard")
    })

    it('should not successfully login a user, when user does not exist', async () => {
        await UserModel.create({
            email: "maito4me@example.com",
            first_name: "Sulaimon",
            last_name: "Rasheed",
            password: "altschool123",
        });

        const response = await supertest(app)
        .post('/users/login')
        .type('form')
        .send({
            email: "adewale@example.com",
            password: "altschool123"
        })
        .expect(302)
        
        expect(response.header.location).toBe("/userNotFound")
      
    })
})
