const supertest = require('supertest');
const app = require('../app');
const { connect } = require('./database');
const blogModel = require("../models/blog")


describe('Authentication Tests', () => {
    let connection
    let token
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


describe('Published blogs endpoint', () => {
    
    it('should render the Published blogs page', async ()=> {
        await blogModel.create({
        title:"NLC TO EMBARK ON A STRIKE", 
         description:"Making the government responsible",
         author:"SULAIMON RASHEED",
         state:"published",
         read_count:0,
         reading_time:"0.1min",
         tag:"POLITICS",
         body:"The nnvnnv nbbvbv nnvnnv nnvnnvnnv nncnncncn bcbb bncn",
         drafted_timestamp:new Date(),
         published_timestamp:new Date(),
         user_id:"652deb9af1382be99a38fb4f"
            
        });
        const response = await supertest(app).get('/published_blogs').set('content-type', 'text/html')
      expect(response.status).toBe(200);
      expect(response.type).toBe('text/html');
      expect(response.text).toContain("SULAIMON RASHEED");
    });
  
  });

})


