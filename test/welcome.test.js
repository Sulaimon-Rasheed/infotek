const supertest = require('supertest');
const app = require('../app');


describe('Root directory', () => {

    
    it("should render the 'welcome page' with title and message", async () => {
        const response = await supertest(app).get('/').set('content-type', 'text/html')

        expect(response.status).toEqual(200)
        expect(response.text).toContain("We've gotten some impactful blogs for you");
        
    })

     
     it("should render the 'pageNotFound' page", async() => {
        const response = await supertest(app).get('/undefined').set('content-type', 'text/html')
        expect(response.status).toEqual(404)
        expect(response.text).toContain("PAGE NOT FOUND");
        
     })
})

describe('Home Route', () => {

    it("should render the 'welcome page' with title and message", async () => {
        const response = await supertest(app).get('/home').set('content-type', 'text/html')

        expect(response.status).toEqual(200)
        expect(response.text).toContain("We've gotten some impactful blogs for you");
    })
})