const Cursos = require("../models/cursosModel");

function agregarCurso(req, res) {
  if (req.user.rol == "ROL_ALUMNO") {
    return res
      .status(500)
      .send({ Error: "Los alumnos no pueden agregar materias" });
  }

  var datos = req.body;
  var modeloCursos = new Cursos();

  if (datos.nombre!=null) {
    modeloCursos.nombre = datos.nombre;

    modeloCursos.idMaestro = req.user.sub;

    Cursos.find(
      { nombre: { $regex: datos.nombre, $options: "i" } },
      (error, nuevaMateria) => {
        if (nuevaMateria.length == 0) {
          modeloCursos.save((error, nuevoCurso) => {
            if (error)
              return res.status(500).send({ Erro: "Error en la peticion." });
            if (error)
              return res
                .status(500)
                .send({ Error: "No se pudo agregar el curso." });

            return res.status(200).send({ Curso_agregado: nuevoCurso });
          });
        } else {
          return res.status(500).send({ Error: "Este curso ya existe." });
        }
      }
    );
  }
}

function editarCurso(req, res) {
  var idCurso = req.params.idMateria;
  var datos = req.body;

  if (req.user.rol == "ROL_ALUMNO") {
    return res
      .status(500)
      .send({ Error: "Los alumnos no pueden modificar cursos." });
  }

  if (idCurso == req.user.sub) {
    return res
      .status(500)
      .send({ Error: "Solo puedes actualizar tus cursos" });
  }

  Cursos.find(
    { nombre: { $regex: datos.nombre, $options: "i" } },
    (error, nuevaMateria) => {
      if (nuevaMateria.length == 0) {
        Cursos.findOneAndUpdate(
          { _id: idCurso, idMaestro: req.user.sub },
          datos,
          { new: true },
          (error, cursoEditado) => {
            if (error)
              return res.status(500).send({ Error: "Error en la peticion." });
            if (!cursoEditado)
              return res
                .status(500)
                .send({ Mensaje: "No se pudo actualizar el curso." });

            return res.status(200).send({ Curso_actualizado: cursoEditado });
          }
        );
      } else {
        return res.status(500).send({ Error: "Este curso ya existe." });
      }
    }
  );
}

function verMaterias(req, res) {
  if (req.user.rol == "ROL_ALUMNO") {
    return res.status(500).send({
      Mensaje:
        "Los alumnos no pueden visualizar las materias de otros profesores",
    });
  }

  Cursos.find({ idMaestro: req.user.sub }, (error, misMaterias) => {
    if (error)
    return res.status(500).send({ Error: "Error en la peticion" });
    if (!misMaterias)
      return res
        .status(500)
        .send({ Error: "Error al querer visualizar sus materias." });
    return res.status(200).send({ Mis_cursos: misMaterias });
  });
}

function borrarCurso(req, res) {
  var idCurso = req.params.IdMateria;

  if (req.user.rol == "ROL_ALUMNO") {
    return res
      .status(500)
      .send({ Mensaje: "Solo los maestros pueden eliminar sus cursos." });
  }

  Cursos.findOneAndDelete(idCurso, (error, cursoEliminado) => {
    if (error)
    return res.status(500).send({ Error: "Error en la peticion." });
    if (!cursoEliminado)
      return res.status(404).send({ Error: "No se pudo borrar el curso." });

    return res.status(200).send({ Curso_eliminado: cursoEliminado });
  });
}


module.exports = {
  agregarCurso,
  verMaterias,
  borrarCurso,
  editarCurso,
};
