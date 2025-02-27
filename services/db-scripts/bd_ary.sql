CREATE DATABASE db_ary;
USE db_ary;

CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(255) NOT NULL,
    rol_usuario ENUM ('administrador', 'empleado', 'invitado') NOT NULL,
    departamento_usuario VARCHAR(255),
    email_usuario VARCHAR(255) UNIQUE,
    contrasena_usuario VARCHAR(255) NOT NULL 
);

CREATE TABLE Archiveros (
    id_archivero INT PRIMARY KEY AUTO_INCREMENT,
    nombre_archivero VARCHAR(255) NOT NULL,
    ubicacion_archivero VARCHAR(255),
    descripcion_archivero TEXT
);

CREATE TABLE Documentos (
    id_documento INT PRIMARY KEY AUTO_INCREMENT,
    nombre_documento VARCHAR(255) NOT NULL,
    descripcion_documento TEXT,
    tipo_documento VARCHAR(50),
    ubicacion_documento VARCHAR(255), -- Puede ser una referencia a la ubicación física o digital
    archivero_id INT NOT NULL,
    FOREIGN KEY (archivero_id) REFERENCES Archiveros(id_archivero)
);

CREATE TABLE Accesos (
    id_acceso INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    documento_id INT NOT NULL,
    fecha_hora_acceso TIMESTAMP NOT NULL,
    tipo_acceso ENUM ('lectura', 'escritura', 'modificacion', 'eliminacion') NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (documento_id) REFERENCES Documentos(id_documento)
);

CREATE TABLE Tarjetas_RFID (
    id_tarjeta INT PRIMARY KEY AUTO_INCREMENT,
    tag_id VARCHAR(255) UNIQUE NOT NULL, -- Identificador único de la tarjeta RFID
    usuario_id INT NOT NULL, -- Usuario asociado a la tarjeta
    fecha_asignacion TIMESTAMP NOT NULL,
    estado_tarjeta ENUM ('activa', 'inactiva', 'perdida') NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id_usuario)
);