const express = require('express');
const router = express.Router();

// Importa las rutas individuales
const authRoutes = require('./auth');
const employeesRoutes = require('./employees')
// const carrerasRoutes = require('./carreras');  // Descomentar cuando existan
// const gruposRoutes = require('./grupos'); 
// const registrosRoutes = require('./registros'); 
// const universidadesRoutes = require('./universidades'); 

// Usa las rutas
router.use('/auth', authRoutes);
router.use('/employees', employeesRoutes);
// router.use('/grupos', gruposRoutes);
// router.use('/registros', registrosRoutes);
// router.use('/universidades', universidadesRoutes);

module.exports = router;
