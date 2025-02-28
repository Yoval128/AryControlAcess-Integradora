const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const connection = require("../db/connection");

// 📌 Ruta de prueba
router.get("/", (req, res) => {
  res.send("Ruta de movimientos_documentos funcionando");
});

// 📌 Obtener todos los movimientos de documentos
router.get("/list-movimiento", (req, res) => {
  connection.query("SELECT * FROM movimientos_documentos", (err, results) => {
    if (err) {
      console.error("Error al obtener los movimientos de documentos:", err);
      return res
        .status(500)
        .json({ error: "Error al obtener los movimientos de documentos" });
    }
    res.status(200).json(results);
  });
});

// 📌 Obtener un movimiento de documento por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "SELECT * FROM movimientos_documentos WHERE ID_Movimiento = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error al obtener el movimiento de documento:", err);
        return res
          .status(500)
          .json({ error: "Error al obtener el movimiento de documento" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: "Movimiento de documento no encontrado" });
      }

      res.status(200).json(results[0]);
    }
  );
});

// 📌 Registrar un movimiento de documento (Salida)
router.post("/register-movimiento", (req, res) => {
  const { ID_Documento, ID_Usuario, Fecha_Hora_Salida, Estado } = req.body;

  if (!ID_Documento || !ID_Usuario || !Fecha_Hora_Salida || !Estado) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  const query = `
      INSERT INTO movimientos_documentos (ID_Documento, ID_Usuario, Fecha_Hora_Salida, Estado) 
      VALUES (?, ?, ?, ?)
    `;

  connection.query(
    query,
    [ID_Documento, ID_Usuario, Fecha_Hora_Salida, Estado],
    (err, results) => {
      if (err) {
        console.error("Error al registrar el movimiento de documento:", err);
        return res
          .status(500)
          .json({ error: "Error al registrar el movimiento de documento" });
      }

      res.status(201).json({
        message: "Movimiento de documento registrado exitosamente",
        id_movimiento: results.insertId,
      });
    }
  );
});

// 📌 Actualizar un movimiento de documento (Estado y/o Fecha de entrada)
router.put("/update-movimiento/:id", (req, res) => {
  const { id } = req.params;
  const { Fecha_Hora_Entrada, Estado } = req.body;

  let query = "UPDATE movimientos_documentos SET ";
  let values = [];

  if (Fecha_Hora_Entrada) {
    query += "Fecha_Hora_Entrada = ?, ";
    values.push(Fecha_Hora_Entrada);
  }

  if (Estado) {
    query += "Estado = ?, ";
    values.push(Estado);
  }

  // Eliminar la última coma
  query = query.slice(0, -2);

  query += " WHERE ID_Movimiento = ?";

  values.push(id);

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Error al actualizar el movimiento de documento:", err);
      return res
        .status(500)
        .json({ error: "Error al actualizar el movimiento de documento" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Movimiento de documento no encontrado" });
    }

    res
      .status(200)
      .json({ message: "Movimiento de documento actualizado exitosamente" });
  });
});

// 📌 Eliminar un movimiento de documento por ID
router.delete("/delete-movimiento/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "DELETE FROM movimientos_documentos WHERE ID_Movimiento = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error al eliminar el movimiento de documento:", err);
        return res
          .status(500)
          .json({ error: "Error al eliminar el movimiento de documento" });
      }

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Movimiento de documento no encontrado" });
      }

      res
        .status(200)
        .json({ message: "Movimiento de documento eliminado exitosamente" });
    }
  );
});

module.exports = router;
