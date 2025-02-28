const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const connection = require("../db/connection");

// 📌 Ruta de prueba
router.get("/", (req, res) => {
  res.send("Ruta de tarjetas RFID funcionando");
});

// 📌 Obtener todas las tarjetas RFID
router.get("/", (req, res) => {
  connection.query("SELECT * FROM tarjetas_rfid", (err, results) => {
    if (err) {
      console.error("Error al obtener las tarjetas RFID:", err);
      return res
        .status(500)
        .json({ error: "Error al obtener las tarjetas RFID" });
    }
    res.status(200).json(results);
  });
});

// 📌 Obtener una tarjeta RFID por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "SELECT * FROM tarjetas_rfid WHERE ID_Tarjeta_RFID = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error al obtener la tarjeta RFID:", err);
        return res
          .status(500)
          .json({ error: "Error al obtener la tarjeta RFID" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Tarjeta RFID no encontrada" });
      }

      res.status(200).json(results[0]);
    }
  );
});

// 📌 Registrar una nueva tarjeta RFID
router.post("/register-tarjeta", (req, res) => {
  const { Codigo_RFID, Estado } = req.body;

  if (!Codigo_RFID || !Estado) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  const query = `
      INSERT INTO tarjetas_rfid (Codigo_RFID, Estado) 
      VALUES (?, ?)
    `;

  connection.query(query, [Codigo_RFID, Estado], (err, results) => {
    if (err) {
      console.error("Error al registrar la tarjeta RFID:", err);
      return res
        .status(500)
        .json({ error: "Error al registrar la tarjeta RFID" });
    }

    res.status(201).json({
      message: "Tarjeta RFID registrada exitosamente",
      id_tarjeta: results.insertId,
    });
  });
});

// 📌 Actualizar el estado de una tarjeta RFID
router.put("/update-tarjeta/:id", (req, res) => {
  const { id } = req.params;
  const { Estado } = req.body;

  if (!Estado) {
    return res.status(400).json({ error: "El estado es requerido" });
  }

  const query = `
      UPDATE tarjetas_rfid SET Estado = ? WHERE ID_Tarjeta_RFID = ?
    `;

  connection.query(query, [Estado, id], (err, results) => {
    if (err) {
      console.error("Error al actualizar la tarjeta RFID:", err);
      return res
        .status(500)
        .json({ error: "Error al actualizar la tarjeta RFID" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Tarjeta RFID no encontrada" });
    }

    res.status(200).json({ message: "Tarjeta RFID actualizada exitosamente" });
  });
});

// 📌 Eliminar una tarjeta RFID por ID
router.delete("/delete-tarjeta/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "DELETE FROM tarjetas_rfid WHERE ID_Tarjeta_RFID = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error al eliminar la tarjeta RFID:", err);
        return res
          .status(500)
          .json({ error: "Error al eliminar la tarjeta RFID" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Tarjeta RFID no encontrada" });
      }

      res.status(200).json({ message: "Tarjeta RFID eliminada exitosamente" });
    }
  );
});

module.exports = router;
