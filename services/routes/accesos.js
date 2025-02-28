const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const connection = require("../db/connection");

// 📌 Ruta de prueba
router.get("/", (req, res) => {
  res.send("Ruta de accesos funcionando");
});

// 📌 Obtener todos los accesos
router.get("/list-access", (req, res) => {
  connection.query("SELECT * FROM accesos", (err, results) => {
    if (err) {
      console.error("Error al obtener los accesos:", err);
      return res.status(500).json({ error: "Error al obtener los accesos" });
    }
    res.status(200).json(results);
  });
});

// 📌 Obtener un acceso por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "SELECT * FROM accesos WHERE ID_Acceso = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error al obtener el acceso:", err);
        return res.status(500).json({ error: "Error al obtener el acceso" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Acceso no encontrado" });
      }

      res.status(200).json(results[0]);
    }
  );
});

// 📌 Registrar un nuevo acceso
router.post("/register-access", (req, res) => {
  const { ID_Usuario, Tipo_Acceso, Ubicacion } = req.body;

  if (!ID_Usuario || !Tipo_Acceso || !Ubicacion) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  const query = `
      INSERT INTO accesos (ID_Usuario, Tipo_Acceso, Ubicacion) 
      VALUES (?, ?, ?)
    `;

  connection.query(
    query,
    [ID_Usuario, Tipo_Acceso, Ubicacion],
    (err, results) => {
      if (err) {
        console.error("Error al registrar el acceso:", err);
        return res.status(500).json({ error: "Error al registrar el acceso" });
      }

      res.status(201).json({
        message: "Acceso registrado exitosamente",
        id_acceso: results.insertId,
      });
    }
  );
});

// 📌 Actualizar un acceso
router.put("/update-access/:id", (req, res) => {
  const { id } = req.params;
  const { Tipo_Acceso, Ubicacion } = req.body;

  if (!Tipo_Acceso || !Ubicacion) {
    return res.status(400).json({
      error: "Tipo de acceso y ubicación son requeridos para la actualización",
    });
  }

  const query = `
      UPDATE accesos
      SET Tipo_Acceso = ?, Ubicacion = ?
      WHERE ID_Acceso = ?
    `;

  connection.query(query, [Tipo_Acceso, Ubicacion, id], (err, results) => {
    if (err) {
      console.error("Error al actualizar el acceso:", err);
      return res.status(500).json({ error: "Error al actualizar el acceso" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Acceso no encontrado" });
    }

    res.status(200).json({ message: "Acceso actualizado exitosamente" });
  });
});

// 📌 Eliminar un acceso por ID
router.delete("/delete-access/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "DELETE FROM accesos WHERE ID_Acceso = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error al eliminar el acceso:", err);
        return res.status(500).json({ error: "Error al eliminar el acceso" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Acceso no encontrado" });
      }

      res.status(200).json({ message: "Acceso eliminado exitosamente" });
    }
  );
});

module.exports = router;
