import React, {useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
import {View, TextInput, Button, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {API_URL} from '@env';

const UserEditScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {usuario_id} = route.params;

    const [nombre_usuario, setNombre_usuario] = useState("");
    const [rol_usuario, setRol_usuario] = useState("");
    const [departamento_usuario, setDepartamento_usuario] = useState("");
    const [email_usuario, setEmail_usuario] = useState("");
    const [contrasena_usuario, setContrasena_usuario] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Obtener datos actuales del usuario al cargar el formulario
        fetch(`${API_URL}/api/employees/employees/${usuario_id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    setNombre_usuario(data.nombre_usuario);
                    setRol_usuario(data.rol_usuario);
                    setDepartamento_usuario(data.departamento_usuario);
                    setEmail_usuario(data.email_usuario);
                } else {
                    setError("No se pudo cargar la información del usuario.");
                }
            })
            .catch((error) => {
                setError("Error al cargar los datos del usuario.");
                console.error(error);
            });
    }, [usuario_id]);

    const handleSubmitCaneclar = () => {
        navigation.goBack();
    }

    const handleSubmit = () => {
        // Validaciones básicas
        if (contrasena_usuario && contrasena_usuario !== passwordConfirm) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (!email_usuario || !nombre_usuario || !rol_usuario) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        setError(""); // Reset de errores
        setMessage(""); // Reset del mensaje

        const userData = {
            nombre_usuario,
            rol_usuario,
            departamento_usuario,
            email_usuario,
            contrasena_usuario: contrasena_usuario || undefined, // No enviar la contraseña si no se cambia
        };

        // Llamada a la API para actualizar la información del usuario
        fetch(`${API_URL}/api/employees/update-employee/${usuario_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    setMessage(data.message); // Mostrar mensaje de éxito
                    navigation.goBack(); // Regresar a la pantalla anterior
                } else if (data.error) {
                    setError(data.error); // Mostrar error
                }
            })

            .catch((error) => {
                setError("Error al actualizar la información. Inténtalo de nuevo.");
                console.error(error);
            });
    };

    return (
        <View style={styles.formContainer}>
            <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                value={nombre_usuario}
                onChangeText={setNombre_usuario}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email_usuario}
                onChangeText={setEmail_usuario}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña (dejar en blanco para no cambiar)"
                value={contrasena_usuario}
                onChangeText={setContrasena_usuario}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                secureTextEntry
            />

            <View style={styles.input}>
                <Text>Departamento</Text>
                <Picker selectedValue={departamento_usuario}
                        onValueChange={(itemValue) => setDepartamento_usuario(itemValue)}>
                    <Picker.Item label="Administración" value="administración"/>
                    <Picker.Item label="Archivo" value="archivo"/>
                    <Picker.Item label="Almacen" value="almacen"/>
                </Picker>
            </View>

            <View style={styles.input}>
                <Text>Rol de usuario</Text>
                <Picker selectedValue={rol_usuario} onValueChange={(itemValue) => setRol_usuario(itemValue)}>
                    <Picker.Item label="Administrador" value="administrador"/>
                    <Picker.Item label="Empleado" value="empleado"/>
                    <Picker.Item label="Invitado" value="invitado"/>
                </Picker>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {message ? <Text style={styles.successText}>{message}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSubmitCaneclar}>
                <Text style={styles.buttonText}>Cencelar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 50,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    successText: {
        color: 'green',
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UserEditScreen;
