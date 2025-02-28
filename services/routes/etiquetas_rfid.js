const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const connection = require("../db/connection");

// 📌 Ruta de prueba
router.get("/", (req, res) => {
    res.send("Ruta de etiquetas_rfid funcionando");
  });

// 📌 Obtener todas las etiquetas RFID
router.get("/list-etiqueta", (req, res) => {
    connection.query("SELECT * FROM etiquetas_rfid", (err, results) => {
      if (err) {
        console.error("Error al obtener las etiquetas RFID:", err);
        return res.status(500).json({ error: "Error al obtener las etiquetas RFID" });
      }
      res.status(200).json(results);
    });
  });
  
  // 📌 Obtener una etiqueta RFID por ID
  router.get("/:id", (req, res) => {
    const { id } = req.params;
  
    connection.query("SELECT * FROM etiquetas_rfid WHERE ID_Etiqueta_RFID = ?", [id], (err, results) => {
      if (err) {
        console.error("Error al obtener la etiqueta RFID:", err);
        return res.status(500).json({ error: "Error al obtener la etiqueta RFID" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "Etiqueta RFID no encontrada" });
      }
  
      res.status(200).json(results[0]);
    });
  });
  
  // 📌 Registrar una nueva etiqueta RFID
  router.post("/register-etiqueta", (req, res) => {
    const { Codigo_RFID, Estado } = req.body;
  
    if (!Codigo_RFID || !Estado) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }
  
    const query = `
      INSERT INTO etiquetas_rfid (Codigo_RFID, Estado) 
      VALUES (?, ?)
    `;
  
    connection.query(query, [Codigo_RFID, Estado], (err, results) => {
      if (err) {
        console.error("Error al registrar la etiqueta RFID:", err);
        return res.status(500).json({ error: "Error al registrar la etiqueta RFID" });
      }
  
      res.status(201).json({
        message: "Etiqueta RFID registrada exitosamente",
        id_etiqueta: results.insertId,
      });
    });
  });
  
  // 📌 Actualizar una etiqueta RFID
  router.put("/update-etiqueta/:id", (req, res) => {
    const { id } = req.params;
    const { Codigo_RFID, Estado } = req.body;
  
    let query = "UPDATE etiquetas_rfid SET ";
    let values = [];
  
    if (Codigo_RFID) {
      query += "Codigo_RFID = ?, ";
      values.push(Codigo_RFID);
    }
  
    if (Estado) {
      query += "Estado = ?, ";
      values.push(Estado);
    }
  
    // Eliminar la última coma
    query = query.slice(0, -2);
  
    query += " WHERE ID_Etiqueta_RFID = ?";
  
    values.push(id);
  
    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Error al actualizar la etiqueta RFID:", err);
        return res.status(500).json({ error: "Error al actualizar la etiqueta RFID" });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Etiqueta RFID no encontrada" });
      }
  
      res.status(200).json({ message: "Etiqueta RFID actualizada exitosamente" });
    });
  });
  
  // 📌 Eliminar una etiqueta RFID por ID
  router.delete("/delete-etiqueta/:id", (req, res) => {
    const { id } = req.params;
  
    connection.query("DELETE FROM etiquetas_rfid WHERE ID_Etiqueta_RFID = ?", [id], (err, results) => {
      if (err) {
        console.error("Error al eliminar la etiqueta RFID:", err);
        return res.status(500).json({ error: "Error al eliminar la etiqueta RFID" });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Etiqueta RFID no encontrada" });
      }
  
      res.status(200).json({ message: "Etiqueta RFID eliminada exitosamente" });
    });
  });

module.exports = router;