const express = require("express");
const router = express.Router();

// Importa las rutas individuales
const authRoutes = require("./auth");
const usersRoutes = require("./users");
const accesosRoutes = require("./accesos");
const administradoresRoutes = require("./administradores");
const documentosRoutes = require("./documentos");
const etiquetasRfidRoutes = require("./etiquetas_rfid");
const movimientosDocumentosRoutes = require("./movimientos_documentos");
const tarjetasRfidRoutes = require("./tarjetas_rfid");
const uploadsRoutes = require("./uploadExcel");
// Usa las rutas
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/accesos", accesosRoutes);
router.use("/administradores", administradoresRoutes);
router.use("/documentos", documentosRoutes);
router.use("/etiquetas-rfid", etiquetasRfidRoutes);
router.use("/movimientos-documentos", movimientosDocumentosRoutes);
router.use("/tarjetas-rfid", tarjetasRfidRoutes);
router.use("/uploadsExcel", uploadsRoutes);

module.exports = router;
