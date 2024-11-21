import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";


export default function Index() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/images/icon.png")} style={styles.logo} />
            <Text style={styles.title}>Welcome to Fursa App</Text>
            <Text style={styles.subtitle}>Find opportunities and manage your career</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push("/jobs")}>
                <Text style={styles.buttonText}>Browse Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.push("/applications")}>
                <Text style={styles.buttonText}>View Applications</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f4f4f8",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2a9d8f",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#555",
        marginBottom: 20,
        textAlign: "center",
    },
    logo: {
        width: 120, 
        height: 120, 
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#2a9d8f",
        padding: 15,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
        marginVertical: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
