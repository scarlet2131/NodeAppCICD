import chai from 'chai';
import chaiHttp from 'chai-http';
import { createServer } from '../app'; // Adjust the path to your app file

let server;

// Use Chai HTTP for HTTP requests
chai.use(chaiHttp);
const { expect } = chai;

// Start the server before running tests
before(() => {
    server = createServer(); // Assuming your app exports a server-creation function
    server.listen(3000, () => {
        console.log('Test server running on http://localhost:3000');
    });
});

// Stop the server after all tests
after(() => {
    server.close(() => {
        console.log('Test server stopped');
    });
});

// Test cases
describe('Express App Tests', () => {
    it('should serve the index.html file at "/" route', async () => {
        const res = await chai.request(server).get('/');
        expect(res).to.have.status(200);
    });

    it('should serve static files from the "public" directory', async () => {
        const res = await chai.request(server).get('/css/style.css');
        expect(res).to.have.status(200);
    });

    it('should return a 404 for an unknown route', async () => {
        const res = await chai.request(server).get('/non-existent-route');
        expect(res).to.have.status(404);
    });
});
