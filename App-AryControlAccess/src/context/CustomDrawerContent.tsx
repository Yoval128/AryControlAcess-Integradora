import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const CustomDrawerContent = (props) => {
    const { user } = props;
    const navigation = useNavigation();

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token'); // Elimina el token
            await AsyncStorage.removeItem('usuario'); // Elimina los datos del usuario
            navigation.replace('Login');// Redirige al usuario al login
        } catch (error) {
            Alert.alert('Error', 'No se pudo cerrar sesión. Inténtalo de nuevo.');
        }
    };


    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.header}>
                <Text style={styles.userName}>{user?.nombre || 'Usuario'}</Text>
                <Text style={styles.userRole}>{user?.rol || 'Sin rol'}</Text>
            </View>

            <DrawerItemList {...props} />

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    header: { padding: 20, backgroundColor: '#007bff', alignItems: 'center' },
    userName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    userRole: { fontSize: 14, color: '#fff' },
    logoutButton: { padding: 15, backgroundColor: 'red', margin: 20, borderRadius: 5, alignItems: 'center' },
    logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default CustomDrawerContent;
