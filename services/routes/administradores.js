const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const connection = require("../db/connection");

// 📌 Ruta de prueba
router.get("/", (req, res) => {
  res.send("Ruta de administradores funcionando");
});

// 📌 Obtener todos los administradores
router.get("/list-admin", (req, res) => {
    connection.query("SELECT * FROM administradores", (err, results) => {
      if (err) {
        console.error("Error al obtener los administradores:", err);
        return res.status(500).json({ error: "Error al obtener los administradores" });
      }
      res.status(200).json(results);
    });
  });
  
  // 📌 Obtener un administrador por ID
  router.get("/:id", (req, res) => {
    const { id } = req.params;
  
    connection.query("SELECT * FROM administradores WHERE ID_Admin = ?", [id], (err, results) => {
      if (err) {
        console.error("Error al obtener el administrador:", err);
        return res.status(500).json({ error: "Error al obtener el administrador" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "Administrador no encontrado" });
      }
  
      res.status(200).json(results[0]);
    });
  });
  
  // 📌 Registrar un nuevo administrador
  router.post("/register-admin", (req, res) => {
    const { ID_Usuario, Nivel_Permiso } = req.body;
  
    if (!ID_Usuario || !Nivel_Permiso) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }
  
    const query = `
      INSERT INTO administradores (ID_Usuario, Nivel_Permiso) 
      VALUES (?, ?)
    `;
  
    connection.query(query, [ID_Usuario, Nivel_Permiso], (err, results) => {
      if (err) {
        console.error("Error al registrar el administrador:", err);
        return res.status(500).json({ error: "Error al registrar el administrador" });
      }
  
      res.status(201).json({
        message: "Administrador registrado exitosamente",
        id_admin: results.insertId,
      });
    });
  });
  
  // 📌 Actualizar un administrador
  router.put("/update-admin/:id", (req, res) => {
    const { id } = req.params;
    const { Nivel_Permiso } = req.body;
  
    if (!Nivel_Permiso) {
      return res.status(400).json({ error: "Nivel de permiso es requerido para la actualización" });
    }
  
    const query = `
      UPDATE administradores
      SET Nivel_Permiso = ?
      WHERE ID_Admin = ?
    `;
  
    connection.query(query, [Nivel_Permiso, id], (err, results) => {
      if (err) {
        console.error("Error al actualizar el administrador:", err);
        return res.status(500).json({ error: "Error al actualizar el administrador" });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Administrador no encontrado" });
      }
  
      res.status(200).json({ message: "Administrador actualizado exitosamente" });
    });
  });
  
  // 📌 Eliminar un administrador por ID
  router.delete("/delete-admin/:id", (req, res) => {
    const { id } = req.params;
  
    connection.query("DELETE FROM administradores WHERE ID_Admin = ?", [id], (err, results) => {
      if (err) {
        console.error("Error al eliminar el administrador:", err);
        return res.status(500).json({ error: "Error al eliminar el administrador" });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Administrador no encontrado" });
      }
  
      res.status(200).json({ message: "Administrador eliminado exitosamente" });
    });
  });

module.exports = router;
