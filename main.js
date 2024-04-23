var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var express = require("express");
var app = express();
var PORT = 8080;
app.use(express.json()); // Middleware pro parsování JSON těl požadavků
// Seznam uživatelů jako pole objektů
var users = [
    { id: 1, name: "Daniel", age: 36 },
    { id: 2, name: "Beka", age: 24 },
    { id: 3, name: "Patrick", age: 21 },
];
// Vyhledá uživatele podle ID
function findUserById(id) {
    return users.find(function (user) { return user.id === parseInt(id); });
}
// GET metoda pro získání všech uživatelů
app.get("/users", function (req, res) {
    res.json(users);
});
// GET metoda pro získání jednoho uživatele
app.get("/users/:id", function (req, res) {
    var user = findUserById(req.params.id);
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.json(user);
});
// PUT metoda pro aktualizaci uživatele
app.put("/users/:id", function (req, res) {
    var index = users.findIndex(function (user) { return user.id === parseInt(req.params.id); });
    if (index === -1) {
        return res.status(404).send("User not found");
    }
    users[index] = __assign(__assign({}, users[index]), req.body);
    res.json(users[index]);
});
// DELETE metoda pro smazání uživatele
app.delete("/users/:id", function (req, res) {
    var index = users.findIndex(function (user) { return user.id === parseInt(req.params.id); });
    if (index === -1) {
        return res.status(404).send("User not found");
    }
    users.splice(index, 1);
    res.status(204).send(); // No Content
});
// Routa pro HTML stránku
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
// Spuštění serveru
app.listen(PORT, function () {
    console.log("Listening on http://localhost:".concat(PORT, " ..."));
});
