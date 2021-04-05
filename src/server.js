const express = require("express");
const server = express();
const routes = require("./routes.js");

server.set("view engine", "ejs");

//Habilitar os arquivos estaticos
server.use(express.static("public"));

//user req.body
server.use(express.urlencoded({extended: true}));

//routes
server.use(routes);

server.listen(3000, () => console.log("rodando"));