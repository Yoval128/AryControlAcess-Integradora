const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const connection = require("../db/connection");

// 📌 Ruta de prueba
router.get("/", (req, res) => {
  res.send("Ruta de registro funcionando");
});

// 📌 Obtener todos los usuarios
router.get("/list-user", (req, res) => {
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
router.get("/user/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "SELECT * FROM usuarios WHERE ID_Usuario = ?",
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
router.post("/register-user", async (req, res) => {
  const {
    nombre,
    apellido,
    cargo,
    correo,
    contrasena,
    telefono,
    id_tarjeta_rfid,
  } = req.body;

  if (!nombre || !apellido || !cargo || !correo || !contrasena) {
    return res
      .status(400)
      .json({ error: "Todos los campos requeridos deben ser proporcionados" });
  }

  try {
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const query =
      "INSERT INTO usuarios (Nombre, Apellido, Cargo, Correo, Contraseña, Telefono, ID_Tarjeta_RFID) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [
      nombre,
      apellido,
      cargo,
      correo,
      hashedPassword,
      telefono || null,  // Si no se proporciona, se almacena como NULL
      id_tarjeta_rfid || null,  // Si no se proporciona, se almacena como NULL
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
router.put("/update-user/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellido,
    cargo,
    correo,
    contrasena,
    telefono,
    id_tarjeta_rfid,
  } = req.body;

  // Preparamos un objeto de valores con los campos que realmente se envían
  let values = [];
  let updateFields = [];

  if (nombre) {
    updateFields.push("Nombre = ?");
    values.push(nombre);
  }

  if (apellido) {
    updateFields.push("Apellido = ?");
    values.push(apellido);
  }

  if (cargo) {
    updateFields.push("Cargo = ?");
    values.push(cargo);
  }

  if (correo) {
    updateFields.push("Correo = ?");
    values.push(correo);
  }

  if (telefono) {
    updateFields.push("Telefono = ?");
    values.push(telefono);
  }

  if (id_tarjeta_rfid) {
    updateFields.push("ID_Tarjeta_RFID = ?");
    values.push(id_tarjeta_rfid);
  }

  if (contrasena) {
    // Encriptar la nueva contraseña si se ha enviado
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);
    updateFields.push("Contraseña = ?");
    values.push(hashedPassword);
  }

  // Si no hay campos para actualizar, devolvemos un error
  if (updateFields.length === 0) {
    return res.status(400).json({ error: "No se proporcionaron datos para actualizar." });
  }

  // Añadir el ID al final de los valores
  values.push(id);

  // Crear la consulta SQL dinámica
  const query = `UPDATE usuarios SET ${updateFields.join(", ")} WHERE ID_Usuario = ?`;

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
router.delete("/delete-user/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "DELETE FROM usuarios WHERE ID_Usuario = ?",
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