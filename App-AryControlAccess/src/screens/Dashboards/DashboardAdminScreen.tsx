import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const DashboardAdminScreen = () => {
    const [user, setUser] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const getUserData = async () => {
            const token = await AsyncStorage.getItem('token');
            const userData = await AsyncStorage.getItem('usuario'); // Asegúrate de que 'usuario' es la clave correcta

            if (token && userData) {
                const userParsed = JSON.parse(userData);
                console.log(userParsed); // Aquí estamos imprimiendo los datos del usuario
                setUser(userParsed); // Establece el usuario desde AsyncStorage
            } else {
                // Redirige si no hay token, es decir, no está autenticado
                navigation.replace("Login");
            }
        };

        getUserData();
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* Perfil */}
            <View style={styles.perfilSection}>
                <View style={styles.profileContainer}>
                    <Image
                        style={{ width: 100, height: 100, marginBottom: 15 }}
                        source={require("../../../assets/icons/perfil-m.png")}
                    />
                    {user ? (
                        <Text>Bienvenido, {user.nombre}!</Text>
                    ) : (
                        <Text>Cargando...</Text>
                    )}
                    {user ? (
                        <Text>{user.rol}</Text>
                    ) : (
                        <Text>Cargando...</Text>
                    )}
                </View>
            </View>

            {/* Opciones */}
            <View style={styles.optionsContainer}>
                <View style={styles.optionRow}>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => navigation.navigate("")}
                    >
                        <Text style={styles.optionText}>Resumen de Accesos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => navigation.navigate("")}
                    >
                        <Text style={styles.optionText}>Estado de las tarjetas RFID</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.optionRow}>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => navigation.navigate("")}
                    >
                        <Text style={styles.optionText}>Gráficas de actividad</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => navigation.navigate("")}
                    >
                        <Text style={styles.optionText}>Otra opción</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 0,
        margin: 0,
    },
    perfilSection: {
        width: "100%",
        backgroundColor: "#ff0000",
    },
    profileContainer: {
        alignItems: "center",
        marginBottom: 20,
        width: "100%",
        backgroundColor: "#5c84ff",
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
    },
    position: {
        fontSize: 16,
        color: "gray",
    },
    optionsContainer: {
        width: "100%",
        paddingHorizontal: 20,
    },
    optionRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    optionButton: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        width: "48%",  // Ajustamos el ancho para que quepan dos en cada fila
        marginBottom: 10,
        alignItems: "center",
    },
    optionText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default DashboardAdminScreen;
