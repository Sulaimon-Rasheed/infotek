const supertest = require('supertest');
const app = require('../app');


describe('Signup and Login Endpoints', () => {
    
    it('should render the signup page', async ()=> {
        const response = await supertest(app).get('/signup').set('content-type', 'text/html')
      expect(response.status).toBe(200);
      expect(response.type).toBe('text/html');
      expect(response.text).toContain("Sign Up");
    });
  
    it('should render the login page', async () => {
        const response = await supertest(app).get('/login').set('content-type', 'text/html')
      expect(response.status).toBe(200);
      expect(response.type).toBe('text/html');
      expect(response.text).toContain("Login");
      
    });
  
  });
  
  
  
  