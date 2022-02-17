const express = require("express");
const controlador = require("../controllers/usuariosController");

const md_autenticacion=require("../middlewares/autenticacion");

var api = express.Router();

api.post("/inicializarMaestro", controlador.primerMaestro);
api.post("/login",controlador.login);
api.post("/registroAlumnos",controlador.registrarAlumnos);
api.post("/registrarMaestros",md_autenticacion.Auth,controlador.registrarMaestros);
api.put("/editarUsuarios/:idUsuario",md_autenticacion.Auth,controlador.editarUsuario)
api.delete("/eliminarUsuarios/:idUsuario",controlador.borrarUsuario)

module.exports = api;