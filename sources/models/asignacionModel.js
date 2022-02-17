const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AsignacionesSchema = Schema({
  idCursoAlumno:{type:Schema.Types.ObjectId,ref:"Cursos"},
  idAlumno:{type:Schema.Types.ObjectId,ref:"Usuarios"}
});

module.exports = mongoose.model("Asignaciones", AsignacionesSchema);
