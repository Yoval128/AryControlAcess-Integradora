const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const connection = require("../db/connection");

// 📌 Ruta de prueba
router.get("/", (req, res) => {
  res.send("Ruta de registro funcionando");
});

// 📌 Obtener todos los usuarios
router.get("/list-employees", (req, res) => {
  connection.query("SELECT * FROM usuarios", (err, results) => {
    if (err) {
      console.error("Error al obtener los usuarios:", err);
      res.status(500).json({ error: "Error al obtener los usuarios" });
      return;
    }
    res.status(200).json(results);
  });
});

// 📌 Obtener un usuario por ID
router.get("/employees/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "SELECT * FROM usuarios WHERE id_usuario = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error al obtener el usuario:", err);
        res.status(500).json({ error: "Error al obtener el usuario" });
        return;
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.status(200).json(results[0]);
    }
  );
});

// 📌 Registrar un nuevo usuario
router.post("/register-employee", async (req, res) => {
  const {
    nombre_usuario,
    rol_usuario,
    departamento_usuario,
    email_usuario,
    contrasena_usuario,
  } = req.body;

  if (
    !nombre_usuario ||
    !rol_usuario ||
    !email_usuario ||
    !contrasena_usuario
  ) {
    return res
      .status(400)
      .json({ error: "Todos los campos requeridos deben ser proporcionados" });
  }

  try {
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena_usuario, salt);

    const query =
      "INSERT INTO usuarios (nombre_usuario, rol_usuario, departamento_usuario, email_usuario, contrasena_usuario) VALUES (?, ?, ?, ?, ?)";
    const values = [
      nombre_usuario,
      rol_usuario,
      departamento_usuario,
      email_usuario,
      hashedPassword,
    ];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Error al registrar el usuario:", err);
        return res.status(500).json({ error: "Error al registrar el usuario" });
      }

      res.status(201).json({
        message: "Usuario registrado exitosamente",
        id_usuario: results.insertId,
      });
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 📌 Actualizar un usuario por ID
router.put("/update-employee/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombre_usuario,
    rol_usuario,
    departamento_usuario,
    email_usuario,
    contrasena_usuario,
  } = req.body;

  // Preparamos un objeto de valores con los campos que realmente se envían
  let values = [];
  let updateFields = [];

  if (nombre_usuario) {
    updateFields.push("nombre_usuario = ?");
    values.push(nombre_usuario);
  }

  if (rol_usuario) {
    updateFields.push("rol_usuario = ?");
    values.push(rol_usuario);
  }

  if (departamento_usuario) {
    updateFields.push("departamento_usuario = ?");
    values.push(departamento_usuario);
  }

  if (email_usuario) {
    updateFields.push("email_usuario = ?");
    values.push(email_usuario);
  }

  if (contrasena_usuario) {
    // Encriptar la nueva contraseña si se ha enviado
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena_usuario, salt);
    updateFields.push("contrasena_usuario = ?");
    values.push(hashedPassword);
  }

  // Si no hay campos para actualizar, devolvemos un error
  if (updateFields.length === 0) {
    return res.status(400).json({ error: "No se proporcionaron datos para actualizar." });
  }

  // Añadir el ID al final de los valores
  values.push(id);

  // Crear la consulta SQL dinámica
  const query = `UPDATE usuarios SET ${updateFields.join(", ")} WHERE id_usuario = ?`;

  try {
    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Error al actualizar el usuario:", err);
        return res.status(500).json({ error: "Error al actualizar el usuario" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.status(200).json({ message: "Usuario actualizado exitosamente" });
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// 📌 Eliminar un usuario por ID
router.delete("/delete-employees/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "DELETE FROM usuarios WHERE id_usuario = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error al eliminar el usuario:", err);
        res.status(500).json({ error: "Error al eliminar el usuario" });
        return;
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.status(200).json({ message: "Usuario eliminado exitosamente" });
    }
  );
});

module.exports = router;
