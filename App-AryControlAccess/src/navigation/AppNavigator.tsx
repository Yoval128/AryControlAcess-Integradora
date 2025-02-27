import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import LoginScreen from "@/src/screens/Auth/LoginScreen";
import DashboardAdminScreen from "@/src/screens/Dashboards/DashboardAdminScreen";
import DashboardEmpleadoScreen from "@/src/screens/Dashboards/DashboardEmpleadoScreen";
import DashboardInvitadoScreen from "@/src/screens/Dashboards/DashboardInvitadoScreen";  // You may want to add this if the role is 'invitado'
import AsyncStorage from "@react-native-async-storage/async-storage";
import UsersListScreen from "@/src/screens/Users/UsersListScreen";
import {Text, View, StyleSheet} from "react-native";
import UserDetailScreen from "@/src/screens/Users/UserDetailScreen";
import UserEditScreen from "@/src/screens/Users/UserEditScreen";
import UserFormScreen from "@/src/screens/Users/UserFormScreen";
import CustomDrawerContent from "@/src/context/CustomDrawerContent";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen}/>
                <Stack.Screen name="Main" component={MainDrawer}/>
                <Stack.Screen name="DashboardAdmin" component={DashboardAdminScreen}/>
                <Stack.Screen name="UserDetail" component={UserDetailScreen}/>
                <Stack.Screen name="UserEdit" component={UserEditScreen}/>
                <Stack.Screen name="UserList" component={UsersListScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const MainDrawer = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserData = async () => {
            const userData = await AsyncStorage.getItem('usuario');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        };
        getUserData();
    }, []);

    if (!user) {
        return null;  // Show nothing or a loading screen until the user data is fetched
    }

    return (
        <Drawer.Navigator  drawerContent={(props) => <CustomDrawerContent {...props} user={user} />}>
            {user?.rol === 'administrador' ? (
                <>
                    <Drawer.Screen name="DashboardAdmin" component={DashboardAdminScreen} options={{title: 'Inicio'}}/>
                    <Drawer.Screen name="userAdd" component={UserFormScreen} options={{title: 'Alta Usuario'}}/>
                    <Drawer.Screen name="UserList" component={UsersListScreen} options={{title: 'Ver Usuarios'}}/>
                </>
            ) : user?.rol === 'empleado' ? (
                <>
                    <Drawer.Screen name="DashboardEmpleado" component={DashboardEmpleadoScreen}
                                   options={{title: 'Inicio'}}/>
                    <Drawer.Screen name="UserList" component={UsersListScreen} options={{title: 'Ver Usuarios'}}/>

                </>
            ) : user?.rol === 'invitado' ? (
                <>
                    <Drawer.Screen name="DashboardInvitado" component={DashboardInvitadoScreen}
                                   options={{title: 'Inicio'}}/>
                    {/* You can add more screens for invited guests if needed */}
                </>
            ) : (
                <Drawer.Screen name="DashboardInvitado" component={DashboardInvitadoScreen}/>
            )}
        </Drawer.Navigator>
    );

};

const styles = StyleSheet.create({
    header: {padding: 20, backgroundColor: '#007bff', alignItems: 'center'},
    userName: {fontSize: 18, fontWeight: 'bold', color: '#fff'},
    userRole: {fontSize: 14, color: '#fff'},
    logoutButton: {padding: 15, backgroundColor: 'red', margin: 20, borderRadius: 5, alignItems: 'center'},
    logoutText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});

export default AppNavigator;
