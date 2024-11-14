import chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import app from '../app.js'; // Ensure your app.js file uses .js extension and exports `app`

const { expect } = chai;

chai.use(chaiHttp);

describe('Express App Tests', () => {
    it('should serve the index.html file at "/" route', async () => {
        const res = await supertest(app).get('/');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('<!DOCTYPE html>'); // Assuming your HTML has this.
    });

    it('should serve static files from the "public" directory', async () => {
        const res = await supertest(app).get('/css/style.css'); // Assuming you have a CSS file in "public/css/style.css".
        expect(res.status).to.equal(200);
        expect(res.header['content-type']).to.include('text/css');
    });

    it('should return a 404 for an unknown route', async () => {
        const res = await supertest(app).get('/unknown-route');
        expect(res.status).to.equal(404);
    });
});
