import './env.js';
import { fastify } from 'fastify';
import fastifyStatic from 'fastify-static';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDb } from './db.js';
import { registerUser } from './accounts/register.js';

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

async function startApp() {
  try {

    app.register(fastifyStatic, {
      root: path.join(__dirname, 'public'),
    });

    // app.get('/', {}, (req, reply) => {
    //   reply.send({
    //     data: 'hello world'
    //   })
    // });

    app.post('/api/register', {}, (request, reply) => {
      try {
        registerUser(request.body.email, request.body.password)
        // console.log('request', req);
      } catch (error) {
        console.error(error);
      }
    })

    await app.listen(3000);
    console.log("Server listening on port 3000");

  } catch (e) {
    console.error(e);
  }
}

connectDb().then(() => startApp());