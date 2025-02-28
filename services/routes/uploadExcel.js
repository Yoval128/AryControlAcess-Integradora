const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const connection = require("../db/connection");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Configurar Multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Guardar el archivo con un nombre único
  }
});

const upload = multer({ storage: storage });

const saltRounds = 10;


// Ruta para cargar el archivo Excel
router.post('/upload-excel', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se ha proporcionado ningún archivo" });
  }

  // Leer el archivo Excel
  const workbook = xlsx.readFile(req.file.path);
  const sheet_name_list = workbook.SheetNames;
  const sheet = workbook.Sheets[sheet_name_list[0]]; // Supongamos que el archivo tiene solo una hoja
  const data = xlsx.utils.sheet_to_json(sheet);

  // Aquí puedes ver los datos que se han extraído
  console.log(data);

  // Llamamos a la función que procesará los datos y los insertará en la base de datos
  processAndInsertData(data, res);
});

// Función para procesar e insertar los datos en las tablas
function processAndInsertData(data, res) {
  data.forEach((row) => {
    // Dependiendo de la estructura de los datos, insertamos en las tablas correspondientes
    // Por ejemplo, para la tabla "accesos", insertamos los datos del archivo Excel

    // Aquí se debe hacer la lógica para determinar a qué tabla pertenece cada dato
    if (row.ID_Usuario && row.Fecha_Hora && row.Tipo_Acceso) {
      connection.query(
        'INSERT INTO accesos (ID_Usuario, Fecha_Hora, Tipo_Acceso, Ubicacion) VALUES (?, ?, ?, ?)',
        [row.ID_Usuario, row.Fecha_Hora, row.Tipo_Acceso, row.Ubicacion],
        (err, results) => {
          if (err) {
            console.error("Error al insertar en accesos:", err);
          }
        }
      );
    }

    if (row.ID_Usuario && row.Nivel_Permiso) {
      connection.query(
        'INSERT INTO administradores (ID_Usuario, Nivel_Permiso) VALUES (?, ?)',
        [row.ID_Usuario, row.Nivel_Permiso],
        (err, results) => {
          if (err) {
            console.error("Error al insertar en administradores:", err);
          }
        }
      );
    }

    if (row.Nombre_Documento && row.Tipo_Documento && row.Ubicacion) {
      connection.query(
        'INSERT INTO documentos (Nombre_Documento, Tipo_Documento, Ubicacion, Estado) VALUES (?, ?, ?, ?)',
        [row.Nombre_Documento, row.Tipo_Documento, row.Ubicacion, row.Estado],
        (err, results) => {
          if (err) {
            console.error("Error al insertar en documentos:", err);
          }
        }
      );
    }

    if (row.Codigo_RFID && row.Estado) {
      connection.query(
        'INSERT INTO etiquetas_rfid (Codigo_RFID, Estado) VALUES (?, ?)',
        [row.Codigo_RFID, row.Estado],
        (err, results) => {
          if (err) {
            console.error("Error al insertar en etiquetas_rfid:", err);
          }
        }
      );
    }

    if (row.ID_Documento && row.ID_Usuario && row.Fecha_Hora_Salida) {
      connection.query(
        'INSERT INTO movimientos_documentos (ID_Documento, ID_Usuario, Fecha_Hora_Salida, Fecha_Hora_Entrada, Estado) VALUES (?, ?, ?, ?, ?)',
        [row.ID_Documento, row.ID_Usuario, row.Fecha_Hora_Salida, row.Fecha_Hora_Entrada, row.Estado],
        (err, results) => {
          if (err) {
            console.error("Error al insertar en movimientos_documentos:", err);
          }
        }
      );
    }

    if (row.Codigo_RFID && row.Estado) {
      connection.query(
        'INSERT INTO tarjetas_rfid (Codigo_RFID, Estado) VALUES (?, ?)',
        [row.Codigo_RFID, row.Estado],
        (err, results) => {
          if (err) {
            console.error("Error al insertar en tarjetas_rfid:", err);
          }
        }
      );
    }

    if (row.Nombre_Usuario && row.Email_Usuario && row.Contrasena_Usuario) {
      // Haseamos la contraseña antes de insertar en la base de datos
      bcrypt.hash(row.Contrasena_Usuario, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error("Error al hashear la contraseña:", err);
          return;
        }
    
        // Usamos la contraseña hasheada en la consulta SQL
        connection.query(
          'INSERT INTO usuarios (Nombre_Usuario, Email_Usuario, Contrasena_Usuario, Rol_Usuario) VALUES (?, ?, ?, ?)',
          [row.Nombre_Usuario, row.Email_Usuario, hashedPassword, row.Rol_Usuario],
          (err, results) => {
            if (err) {
              console.error("Error al insertar en usuarios:", err);
            }
          }
        );
      });
    }
  });

  res.status(200).json({ message: "Datos procesados e insertados exitosamente" });
}

module.exports = router;
