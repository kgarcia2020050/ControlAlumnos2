const express = require("express");
const cors = require("cors");
var app = express();

const rutaUsuario=require("./sources/routes/rutasUsuario")
const rutaCurso=require("./sources/routes/rutasCurso")
const rutaAsigns=require("./sources/routes/rutasAsings")
 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use("/api",rutaUsuario,rutaCurso,rutaAsigns);

module.exports = app;
