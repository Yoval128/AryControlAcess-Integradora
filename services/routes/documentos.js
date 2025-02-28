const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const connection = require("../db/connection");

// 📌 Ruta de prueba
router.get("/", (req, res) => {
  res.send("Ruta de documentos funcionando");
});

// 📌 Obtener todos los documentos
router.get("/list-documents", (req, res) => {
    connection.query("SELECT * FROM documentos", (err, results) => {
      if (err) {
        console.error("Error al obtener los documentos:", err);
        return res.status(500).json({ error: "Error al obtener los documentos" });
      }
      res.status(200).json(results);
    });
  });
  
  // 📌 Obtener un documento por ID
  router.get("/:id", (req, res) => {
    const { id } = req.params;
  
    connection.query("SELECT * FROM documentos WHERE ID_Documento = ?", [id], (err, results) => {
      if (err) {
        console.error("Error al obtener el documento:", err);
        return res.status(500).json({ error: "Error al obtener el documento" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "Documento no encontrado" });
      }
  
      res.status(200).json(results[0]);
    });
  });
  
  // 📌 Registrar un nuevo documento
  router.post("/register-document", (req, res) => {
    const { Nombre_Documento, Tipo_Documento, Ubicacion, Estado, ID_Etiqueta_RFID } = req.body;
  
    if (!Nombre_Documento || !Tipo_Documento || !Ubicacion || !Estado) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }
  
    const query = `
      INSERT INTO documentos (Nombre_Documento, Tipo_Documento, Ubicacion, Estado, ID_Etiqueta_RFID) 
      VALUES (?, ?, ?, ?, ?)
    `;
  
    connection.query(query, [Nombre_Documento, Tipo_Documento, Ubicacion, Estado, ID_Etiqueta_RFID], (err, results) => {
      if (err) {
        console.error("Error al registrar el documento:", err);
        return res.status(500).json({ error: "Error al registrar el documento" });
      }
  
      res.status(201).json({
        message: "Documento registrado exitosamente",
        id_documento: results.insertId,
      });
    });
  });
  
  // 📌 Actualizar un documento
  router.put("/update-document/:id", (req, res) => {
    const { id } = req.params;
    const { Nombre_Documento, Tipo_Documento, Ubicacion, Estado, ID_Etiqueta_RFID } = req.body;
  
    let query = "UPDATE documentos SET ";
    let values = [];
  
    if (Nombre_Documento) {
      query += "Nombre_Documento = ?, ";
      values.push(Nombre_Documento);
    }
    if (Tipo_Documento) {
      query += "Tipo_Documento = ?, ";
      values.push(Tipo_Documento);
    }
    if (Ubicacion) {
      query += "Ubicacion = ?, ";
      values.push(Ubicacion);
    }
    if (Estado) {
      query += "Estado = ?, ";
      values.push(Estado);
    }
    if (ID_Etiqueta_RFID) {
      query += "ID_Etiqueta_RFID = ?, ";
      values.push(ID_Etiqueta_RFID);
    }
  
    // Eliminar la última coma
    query = query.slice(0, -2);
  
    query += " WHERE ID_Documento = ?";
  
    values.push(id);
  
    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Error al actualizar el documento:", err);
        return res.status(500).json({ error: "Error al actualizar el documento" });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Documento no encontrado" });
      }
  
      res.status(200).json({ message: "Documento actualizado exitosamente" });
    });
  });
  
  // 📌 Eliminar un documento por ID
  router.delete("/delete-document/:id", (req, res) => {
    const { id } = req.params;
  
    connection.query("DELETE FROM documentos WHERE ID_Documento = ?", [id], (err, results) => {
      if (err) {
        console.error("Error al eliminar el documento:", err);
        return res.status(500).json({ error: "Error al eliminar el documento" });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Documento no encontrado" });
      }
  
      res.status(200).json({ message: "Documento eliminado exitosamente" });
    });
  });

module.exports = router;
