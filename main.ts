const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.json()); // Middleware pro parsování JSON těl požadavků

// Seznam uživatelů jako pole objektů
let users = [
  { id: 1, name: "Daniel", age: 36 },
  { id: 2, name: "Beka", age: 24 },
  { id: 3, name: "Patrick", age: 21 },
];

// Vyhledá uživatele podle ID
function findUserById(id) {
  return users.find((user) => user.id === parseInt(id));
}

// GET metoda pro získání všech uživatelů
app.get("/users", (req, res) => {
  res.json(users);
});

// GET metoda pro získání jednoho uživatele
app.get("/users/:id", (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.json(user);
});

// PUT metoda pro aktualizaci uživatele
app.put("/users/:id", (req, res) => {
  const index = users.findIndex((user) => user.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send("User not found");
  }
  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
});

// POST
app.post("/users", (req, res) => {
  const newUser = {
    id: users.length + 1, // Jednoduchá logika pro určení nového ID
    name: req.body.name,
    age: parseInt(req.body.age),
  };

  // Ověření, že jméno a věk byly poskytnuty
  if (!newUser.name || isNaN(newUser.age)) {
    return res.status(400).send("Invalid user data");
  }

  // Přidání nového uživatele do seznamu
  users.push(newUser);

  // Odpověď se všemi uživateli nebo jen nově přidaným uživatelem
  res.status(201).json(newUser);
});

// DELETE metoda pro smazání uživatele
app.delete("/users/:id", (req, res) => {
  const index = users.findIndex((user) => user.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send("User not found");
  }
  users.splice(index, 1);
  res.status(204).send(); // No Content
});

// Routa pro HTML stránku
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Spuštění serveru
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT} ...`);
});
