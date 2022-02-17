const Usuarios = require("../models/usuariosModel");
const encriptar = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

function registrarMaestros(req, res) {
  if (req.user.rol == "ROL_ALUMNO") {
    return res
      .status(500)
      .send({ Error: "Los alumnos no pueden registrar maestros." });
  }

  var datos = req.body;
  var modeloUsuario = new Usuarios();
  if (datos.nombre && datos.usuario && datos.password) {
    modeloUsuario.nombre = datos.nombre;
    modeloUsuario.usuario = datos.usuario;
    modeloUsuario.rol = "ROL_MAESTRO";

    Usuarios.find(
      { usuario: { $regex: datos.usuario, $options: "i" } },
      (error, nuevoMaestro) => {
        if (nuevoMaestro.length == 0) {
          encriptar.hash(
            datos.password,
            null,
            null,
            (error, claveEncriptada) => {
              modeloUsuario.password = claveEncriptada;
              modeloUsuario.save((error, nuevoMaestro) => {
                if (error)
                  return res
                    .status(500)
                    .send({ Error: "Error en la peticion." });
                if (!nuevoMaestro)
                  return res.status(404).send({
                    Error: "No se pudo agregar al maestro.",
                  });
                return res.status(200).send({ Maestro_agregado: nuevoMaestro });
              });
            }
          );
        } else {
          return res
            .status(500)
            .send({ Error: "Este usuario ya existe, utiliza uno diferente." });
        }
      }
    );
  }
}

function registrarAlumnos(req, res) {
  if (req.user.rol == "ROL_ALUMNO") {
    return res
      .status(500)
      .send({ Error: "Los alumnos no pueden registrar a otros alumnos." });
  }

  var datos = req.body;
  var modeloUsuario = new Usuarios();
  if (datos.nombre!=null&& datos.usuario!=null && datos.password!=null) {
    modeloUsuario.nombre = datos.nombre;
    modeloUsuario.usuario = datos.usuario;
    modeloUsuario.rol = "ROL_ALUMNO";

    Usuarios.find(
      { usuario: { $regex: datos.usuario, $options: "i" } },
      (error, nuevoAlumno) => {
        if (nuevoAlumno.length == 0) {
          encriptar.hash(
            datos.password,
            null,
            null,
            (error, claveEncriptada) => {
              modeloUsuario.password = claveEncriptada;
              modeloUsuario.save((error, nuevoAlumno) => {
                if (error)
                  return res
                    .status(500)
                    .send({ Error: "Error en la peticion." });
                if (!nuevoAlumno)
                  return res.status(404).send({
                    Error: "No se pudo agregar al estudiante.",
                  });
                return res.status(200).send({ Alumno_agregado: nuevoAlumno });
              });
            }
          );
        } else {
          return res
            .status(500)
            .send({ Error: "Este usuario ya existe, utiliza uno diferente." });
        }
      }
    );
  }
}

function primerMaestro(req, res) {
  var datos = req.body;
  var modeloUsuario = new Usuarios();

  if (datos.nombre == null && datos.usuario == null && datos.password == null) {
    modeloUsuario.nombre = "MAESTRO_UNO";
    modeloUsuario.usuario = "MAESTRO";
    modeloUsuario.rol = "ROL_MAESTRO";
    clave = "123456";
    Usuarios.find((error, primerMaestro) => {
      if (primerMaestro.length == 0) {
        encriptar.hash(clave, null, null, (error, claveEncriptada) => {
          modeloUsuario.password = claveEncriptada;
          modeloUsuario.save((error, primerMaestro) => {
            if (error)
              return res.status(500).send({ Error: "Error en la peticion." });
            if (!primerMaestro)
              return res.status(404).send({
                Error: "No se pudo inicializar al maestro.",
              });
            return res.status(200).send({ Primer_maestro: primerMaestro });
          });
        });
      } else {
        return res.status(500).send({ Error: "Ya se creo al primer maestro." });
      }
    });
  }
}

function login(req, res) {
  var datos = req.body;
  Usuarios.findOne({ usuario: datos.usuario }, (error, usuarioEncontrado) => {
    if (error) return res.status(500).send({ Error: "Error en la peticion." });
    if (usuarioEncontrado) {
      encriptar.compare(
        datos.password,
        usuarioEncontrado.password,
        (error, verificacionDePassword) => {
          if (verificacionDePassword) {
            if (datos.obtenerToken === "true") {
              return res
                .status(200)
                .send({ token: jwt.crearToken(usuarioEncontrado) });
            } else {
              usuarioEncontrado.password = undefined;
              return res.status(500).send({ Usuario: usuarioEncontrado });
            }
          } else {
            return res.status(500).send({ Error: "La clave no coincide." });
          }
        }
      );
    } else {
      return res.status(500).send({ Error: "Los datos de inicio no existen." });
    }
  });
}

function editarUsuario(req, res) {

  var idUser = req.params.idUsuario;
  var datos = req.body;

  if (idUser != req.user.sub)
    return res
      .status(500)
      .send({ Mensaje: "No puedes modificar a otros usuarios." });

  Usuarios.findByIdAndUpdate(
    req.user.sub,
    datos,
    { new: true },
    (error, usuarioEditado) => {
      if (error)
        return res.status(500).send({ Error: "Error en la peticion." });
      if (!usuarioEditado)
        return res
          .status(404)
          .send({ Error: "No se pudo actualizar el usuario." });
      usuarioEditado.password = undefined;
      return res.status(200).send({ Usuario_actualizado: usuarioEditado });
    }
  );
}

function borrarUsuario(req, res) {
  var idUser = req.params.idUsuario;
  if (idUser != req.user.sub) {
    return res
      .status(500)
      .send({ Mensaje: "No puedes eliminar a otros usuarios." });
  }

  Usuarios.findByIdAndDelete(idUser, (error, usuarioBorrado) => {
    if (error)
    return res.status(500).send({ Error: "Error en la peticion." });
    if (!usuarioBorrado)
      return res.status(404).send({ Error: "No se pudo borrar al usuario." });

    return res.status(200).send({ Usuario_eliminado: usuarioBorrado });
  });
}

module.exports = {
  primerMaestro,
  login,
  registrarAlumnos,
  registrarMaestros,
  editarUsuario,
  borrarUsuario,
};
