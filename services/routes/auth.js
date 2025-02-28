const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const connection = require("../db/connection");
const bcrypt = require("bcryptjs");

// Ruta de Prueba 
router.get('/', (req, res) => {
    res.send('Ruta de autenticación funcionando');
});

// Ruta de Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validar que ambos campos están presentes
  if (!email || !password) {
    return res.status(400).json({ error: "Correo y contraseña son requeridos" });
  }

  // Consultar el usuario en la base de datos
  connection.query(
      "SELECT * FROM usuarios WHERE Correo = ?",
      [email],
      (err, results) => {
          if (err) {
              console.error("Error al verificar usuario:", err);
              return res.status(500).json({ error: "Error en el servidor" });
          }

          if (results.length === 0) {
              return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
          }

          const usuario = results[0];

          // Comparar las contraseñas
          bcrypt.compare(password, usuario.Contraseña, (err, isMatch) => {
              if (err) {
                  console.error("Error al comparar contraseñas:", err);
                  return res.status(500).json({ error: "Error en el servidor" });
              }

              if (!isMatch) {
                  return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
              }

              // Generar el token JWT
              const token = jwt.sign(
                  { 
                      id: usuario.ID_Usuario, 
                      email: usuario.Correo, 
                      rol: usuario.Cargo 
                  },
                  process.env.JWT_SECRET_KEY, // Usar variable de entorno para la clave secreta
                  { expiresIn: "1h" } // El token expirará en 1 hora
              );

              // Devolver la respuesta con el token y los datos del usuario
              res.json({
                  message: "Login exitoso",
                  token,
                  usuario: {
                      id: usuario.ID_Usuario,
                      nombre: usuario.Nombre,
                      apellido: usuario.Apellido,
                      email: usuario.Correo,
                      rol: usuario.Cargo,
                      telefono: usuario.Telefono,
                      id_tarjeta_rfid: usuario.ID_Tarjeta_RFID, 
                  },
              });
          });
      }
  );
});

module.exports = router;