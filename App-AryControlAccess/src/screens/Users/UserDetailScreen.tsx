import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { API_URL } from "@env";
import { useRoute } from "@react-navigation/native";

const UserDetailScreen = () => {
    const route = useRoute();
    const { usuario_id } = route.params;  // Obtener el id del empleado pasado por la navegación

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Llamar a la API para obtener los detalles del empleado
    useEffect(() => {
        const fetchEmployeeDetail = async () => {
            try {
                const response = await fetch(`${API_URL}/api/employees/employees/${usuario_id}`);
                if (!response.ok) throw new Error("Error al obtener los detalles del empleado.");

                const data = await response.json();
                setEmployee(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeDetail();
    }, [usuario_id]);

    if (loading) return <ActivityIndicator size="large" color="#007bff" />;
    if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

    return (
        <View style={styles.container}>
            {employee ? (
                <>
                    <Text style={styles.label}>Nombre: {employee.nombre_usuario}</Text>
                    <Text style={styles.label}>Email: {employee.email_usuario}</Text>
                    <Text style={styles.label}>Rol: {employee.rol_usuario}</Text>
                    <Text style={styles.label}>Departamento: {employee.departamento_usuario}</Text>
                </>
            ) : (
                <Text>No se encontraron detalles del empleado.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    errorText: {
        textAlign: "center",
        color: "red",
        marginTop: 20,
    },
});

export default UserDetailScreen;
