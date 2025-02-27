import React, {useEffect, useState} from 'react';
import {View, Text} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const DashboardInvitadoScreen = () => {
    const [user, setUser] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const getUserData = async () => {
            console.log("Dasboard Invitado");
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
        <View>
            {user ? (
                <Text>Bienvenido, {user.nombre}!</Text>

            ) : (
                <Text>Cargando...</Text>
            )}
            {user ? (
                <Text>Bienvenido, {user.rol}!</Text>

            ) : (
                <Text>Cargando...</Text>
            )}

        </View>

    );
};

export default DashboardInvitadoScreen;
