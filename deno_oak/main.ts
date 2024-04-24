import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();
const PORT = 8080;

let users = [
  { id: 1, name: "Daniel", age: 36 },
  { id: 2, name: "Beka", age: 24 },
  { id: 3, name: "Patrick", age: 21 },
];

function findUserById(id) {
  return users.find((user) => user.id === parseInt(id));
}

router
  .get("/users", (context) => {
    context.response.body = users;
  })
  .get("/users/:id", (context) => {
    if (context.params && context.params.id) {
      const user = findUserById(context.params.id);
      if (!user) {
        context.response.status = 404;
        context.response.body = "User not found";
        return;
      }
      context.response.body = user;
    }
  })
  .post("/users", async (context) => {
    if (!context.request.hasBody) {
      context.response.status = 400;
      context.response.body = "Bad Request: No data sent";
      return;
    }

    const result = await context.request
      .body({ type: "json" })
      .value.catch((e) => {
        context.response.status = 400;
        context.response.body = `Bad Request: Could not decode JSON - ${e.message}`;
        return null;
      });

    // Kontrola, zda předchozí krok vrátil platnou hodnotu
    if (!result) return;

    if (!result.name || isNaN(parseInt(result.age))) {
      context.response.status = 400;
      context.response.body = "Invalid user data: Missing name or invalid age";
      return;
    }

    const newUser = {
      id: users.length + 1,
      name: result.name,
      age: parseInt(result.age),
    };

    users.push(newUser);
    context.response.status = 201;
    context.response.body = newUser;
  })
  .put("/users/:id", async (context) => {
    if (context.params && context.params.id) {
      const index = users.findIndex(
        (user) => user.id === parseInt(context.params.id)
      );
      if (index === -1) {
        context.response.status = 404;
        context.response.body = "User not found";
        return;
      }
      const result = await context.request.body().value;
      users[index] = { ...users[index], ...result };
      context.response.body = users[index];
    }
  })
  .delete("/users/:id", (context) => {
    if (context.params && context.params.id) {
      const index = users.findIndex(
        (user) => user.id === parseInt(context.params.id)
      );
      if (index === -1) {
        context.response.status = 404;
        context.response.body = "User not found";
        return;
      }
      users.splice(index, 1);
      context.response.status = 204;
    }
  })
  .get("/", async (context) => {
    const text = await Deno.readTextFile("./index.html");
    context.response.headers.set("Content-Type", "text/html");
    context.response.body = text;
  });

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", () => {
  console.log(`Listening on http://localhost:${PORT} ...`);
});

await app.listen({ port: PORT });
