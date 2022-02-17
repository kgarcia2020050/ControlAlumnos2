const Asigns = require("../models/asignacionModel");

const pdf = require("pdfkit");

function misMaterias(req, res) {
  if (req.user.rol == "ROL_MAESTRO") {
    return res
      .status(500)
      .send({ Error: "Solo los alumnos pueden ver sus cursos." });
  }

  Asigns.find({ idAlumno: req.user.sub }, (error, asignEncontrada) => {
    if (error) 
    return res.status(500).send({ Error: "Error en la peticion." });
    if (!asignEncontrada)
      return res.status(404).send({ Error: "No tienes materias asignadas." });

    return res.status(200).send({ Asignacion: asignEncontrada });
  });
}

function generarPdf(req, res) {
  if (req.user.rol == "ROL_MAESTRO") {
    return res.status(500).send({
      Error: "Solo los alumnos se pueden descargar sus cursos.",
    });
  }

  Asigns.find({ idAlumno: req.user.sub }, (error, asignEncontrada) => {
    var doc = new pdf();
    var datos = { Mis_cursos: asignEncontrada };
    doc
      .fontSize(10)
      .fillColor("blue")
      .text(JSON.stringify(datos, null, 2), 100, 100);

    doc.pipe(res);

    doc.end();
  });
}


module.exports = {
  misMaterias,
  generarPdf,
};
