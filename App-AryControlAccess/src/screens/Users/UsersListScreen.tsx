import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert} from "react-native";
import {API_URL} from "@env";
import {useNavigation} from "@react-navigation/native";
import {useFocusEffect} from "expo-router";

interface Employee {
    id_usuario: number;
    nombre_usuario: string;
    rol_usuario: string;
    departamento_usuario: string;
    email_usuario: string;
}

const UsersListScreen = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        fetchEmployees();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            // Llamada para obtener los empleados al volver a la pantalla
            fetchEmployees();
        }, [])
    );

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${API_URL}/api/employees/listemployees`);
            if (!response.ok) throw new Error("Error al obtener los empleados");

            const data = await response.json();
            setEmployees(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const eliminarEmpleado = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/api/employees/deleteemployees/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${data.error || "No se pudo eliminar"}`);
            }

            setEmployees((prev) => prev.filter((employee) => employee.id_usuario !== id));
            fetchEmployees();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };


    if (loading) return <ActivityIndicator size="large" color="#007bff"/>;
    if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

    return (
        <View style={styles.listContainer}>
            {employees.length > 0 ? (
                <FlatList
                    data={employees}
                    keyExtractor={(item) => item.id_usuario.toString()}
                    renderItem={({item}) => (
                        <View style={styles.employeeItem}>
                            <Text style={styles.name}>{item.nombre_usuario}</Text>
                            <Text>{item.rol_usuario} - {item.departamento_usuario}</Text>
                            <Text style={styles.email}>{item.email_usuario}</Text>

                            {/* Botones de acción */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.detailButton}
                                    onPress={() => navigation.navigate("UserDetail", {usuario_id: item.id_usuario})}>
                                    <Text style={styles.buttonText}>Ver Detalle</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => navigation.navigate("UserEdit", {usuario_id: item.id_usuario})}>
                                    <Text style={styles.buttonText}>Editar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => eliminarEmpleado(item.id_usuario)}>
                                    <Text style={styles.buttonText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noEmployeesText}>No hay empleados disponibles.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 20,
    },
    employeeItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    email: {
        fontSize: 14,
        color: "gray",
    },
    noEmployeesText: {
        textAlign: "center",
        fontSize: 16,
        marginTop: 20,
    },
    errorText: {
        textAlign: "center",
        fontSize: 16,
        color: "red",
        marginTop: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "space-between",
    },
    detailButton: {
        backgroundColor: "#3498db",
        padding: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    editButton: {
        backgroundColor: "#f1c40f",
        padding: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    deleteButton: {
        backgroundColor: "#e74c3c",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default UsersListScreen;
