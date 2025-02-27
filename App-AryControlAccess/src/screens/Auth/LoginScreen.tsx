import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Alert} from "react-native";
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email_usuario, setEmail_usuario] = useState('');
    const [contraseña_usuario, setContraseña_usuario] = useState('');

    const handleLogin = async () => {
        console.log('login');
        if (!email_usuario || !contraseña_usuario) {
            Alert.alert("Error", "Por favor ingresa el correo y la contraseña");
            return;
        }

        try {
            console.log("Consulta API")
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    email: email_usuario,
                    password: contraseña_usuario,
                }),
            });
            console.log("Json");
            const data = await response.json();
            console.log(data);  // Mostrar toda la respuesta para depuración

            if (response.status === 200) {
                console.log("Tokens");
                // Guardar token y datos del usuario en AsyncStorage
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));

                // Mostrar el objeto completo de usuario para ver su estructura
                console.log(data.usuario);  // Ver la estructura del objeto usuario
                console.log(data.usuario.rol);
                // Verificar rol del usuario y redirigir
                if (data.usuario && data.usuario.rol === 'administrador') {
                    console.log("Entrandor a la navegacion...");
                    // Si es administrador, redirigir al dashboard de admin
                    navigation.replace('Main');
                    console.log("Sale de la navegacion...");
                } else if (data.usuario && data.usuario.rol === 'empleado') {
                    // Si es empleado, redirigir al dashboard de empleado
                    navigation.replace('Main');

                } else if (data.usuario && data.usuario.rol === 'invitado') {
                    // Si es empleado, redirigir al dashboard de empleado
                    navigation.replace('Main');

                } else {
                    // En caso de un rol no esperado, mostrar un error
                    console.log('Error al entrar');
                    console.log(data.usuario.rol);
                    Alert.alert('Error', 'Rol de usuario desconocido');
                }
            } else {
                Alert.alert('Error', data.error || 'Hubo un problema con el login');
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al iniciar sesión');
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo"
                value={email_usuario}
                onChangeText={setEmail_usuario}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={contraseña_usuario}
                onChangeText={setContraseña_usuario}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f4f4f4"},
    title: {fontSize: 24, fontWeight: "bold", marginBottom: 20},
    input: {width: "80%", padding: 10, marginVertical: 10, borderWidth: 1, borderRadius: 8, backgroundColor: "#fff"},
    button: {backgroundColor: "#007bff", padding: 12, borderRadius: 8, marginTop: 10},
    buttonText: {color: "#fff", fontWeight: "bold"}
});

export default LoginScreen;
