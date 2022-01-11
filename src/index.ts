import fastify, { FastifyRequest } from "fastify";
import fastifyStatic from "fastify-static";
import fastifyCookie from "fastify-cookie";
import path from "path";
import "./env";
import { connectDb } from "./db";
import { registerUser } from "./accounts/register";
import { authorizeUser } from "./accounts/authorize";
import { logUserIn } from "./accounts/logUserIn";
import { getUserFromCookies } from "./accounts/user";
import { logUserOut } from "./accounts/logUserOut";

interface Request extends FastifyRequest {
  body: any;
}

// ESM specific features
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = fastify();

async function startApp() {
  try {
    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SIGNATURE,
    });

    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
      prefix: "/public/",
    });

    app.get('/', async (request, reply) => {
      reply.sendFile('index.html');
      // reply.send({msg: "hello!"})
    })

    app.post("/api/register", {}, async (request: Request, reply) => {
      try {
        const userId = await registerUser(
          request.body.email,
          request.body.password
        );
        if (userId) {
          await logUserIn(userId, request, reply);
        }
        reply.send({
          data: {
            status: "SUCCESS",
            userId,
          },
        });
      } catch (error) {
        console.error(error);
        reply.send({
          data: {
            status: "FAILED",
          },
        });
      }
    });

    app.post("/api/logout", {}, async (request, reply) => {
      try {
        await logUserOut(request, reply);
        reply.send("user logged out");
      } catch (error) {
        console.error(error);
      }
    });

    app.post("/api/authorize", {}, async (request: Request, reply) => {
      try {
        console.log(request.body.email, request.body.password);
        const { isAuthorized, userId } = await authorizeUser(
          request.body.email,
          request.body.password
        );
        if (isAuthorized && userId) {
          await logUserIn(userId, request, reply);
          reply.send({
            data: {
              status: "SUCCESS",
              userId,
            },
          });
        }
        reply.send({ data: "auth failed" });
      } catch (error) {
        reply.send({
          data: {
            status: "FAILED",
          },
        });
      }
    });

    app.get("/test", {}, async (request, reply) => {
      // Verify user login
      try {
        const user = await getUserFromCookies(request, reply);

        // return user email if it exists, otherwise return unquthorized
        if (user?._id) {
          reply.send({ data: user });
        } else {
          reply.send({ data: "user lookup failed" });
        }
      } catch (error) {
        console.error(error);
      }

      reply.send({ data: "hello world" });
    });

    await app.listen(3000);
    console.log("Server listening on port 3000");
  } catch (e) {
    console.error(e);
  }
}

connectDb().then(() => startApp());
