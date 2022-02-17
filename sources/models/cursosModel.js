const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CursosSchema = Schema({
  nombre: String,
  idMaestro:{type:Schema.Types.ObjectId,ref:"Usuarios"}
});

module.exports = mongoose.model("Cursos", CursosSchema);
