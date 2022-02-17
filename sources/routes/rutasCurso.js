const express = require("express");
const controlador = require("../controllers/cursosController");

const md_autenticacion=require("../middlewares/autenticacion");

var api = express.Router();

api.post("/agregarMaterias",md_autenticacion.Auth,controlador.agregarCurso)

api.put("/editarCursos/:idMateria",md_autenticacion.Auth,controlador.editarCurso)

api.delete("/eliminarCurso/:idMateria",md_autenticacion.Auth,controlador.borrarCurso)

api.get("/verMaterias",md_autenticacion.Auth,controlador.verMaterias)


module.exports=api