const express = require("express");
const controlador = require("../controllers/asignsController");

const md_autenticacion=require("../middlewares/autenticacion");

var api = express.Router();

api.get("/pdf",md_autenticacion.Auth,controlador.generarPdf)
api.get("/verAsigns",md_autenticacion.Auth,controlador.misMaterias)

module.exports=api