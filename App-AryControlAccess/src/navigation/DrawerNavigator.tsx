import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardAdminScreen from '@/src/screens/Dashboards/DashboardAdminScreen';
import DashboardEmpleadoScreen from '@/src/screens/Dashboards/DashboardEmpleadoScreen';
import DashboardInvitadoScreen from '@/src/screens/Dashboards/DashboardInvitadoScreen';
import UserFormScreen from '@/src/screens/Users/UserFormScreen';
import UserList from '@/src/screens/Users/UsersListScreen';
import CustomDrawerContent from '@/src/context/CustomDrawerContent';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);  // Añadido el estado loading

    useEffect(() => {
        const getUserData = async () => {
            const userData = await AsyncStorage.getItem('usuario');
            if (userData) {
                setUser(JSON.parse(userData));
            }
            setLoading(false);  // Marca como cargado cuando los datos estén listos
        };
        getUserData();
    }, []);

    if (loading) {
        return <Text>Cargando...</Text>;  // Puede poner una pantalla de carga aquí
    }

    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} user={user} />}>
            {user?.rol === 'administrador' ? (
                <>
                    <Drawer.Screen name="DashboardAdmin" component={DashboardAdminScreen} options={{title: 'Inicio'}} />
                    <Drawer.Screen name="Usuarios" component={UserFormScreen} options={{title: 'Gestión de Usuarios'}} />
                </>
            ) : user?.rol === 'empleado' ? (
                <>
                    <Drawer.Screen name="DashboardEmpleado" component={DashboardEmpleadoScreen} options={{title: 'Inicio'}} />
                    <Drawer.Screen name="Usuarios" component={UserList} options={{title: 'Ver Usuarios'}} />
                </>
            ) : (
                <Drawer.Screen name="DashboardInvitado" component={DashboardInvitadoScreen} options={{title: 'Inicio'}} />
            )}
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
