import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://192.168.1.103:8000/api"; // Replace with your backend URL

export default function ApplicationsScreen() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = await SecureStore.getItemAsync("authToken");
                if (!token) {
                    Alert.alert("Error", "You are not logged in.");
                    return;
                }

                const response = await fetch(`${BASE_URL}/applications/`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setApplications(data);
                } else {
                    console.error("Failed to fetch applications");
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#2a9d8f" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Applications</Text>
            <FlatList
                data={applications}
                keyExtractor={(item) => item.id.toString()} // Use application ID as key
                renderItem={({ item }) => (
                    <View style={styles.applicationCard}>
                        <Text style={styles.jobTitle}>{item.job.title}</Text>
                        <Text style={styles.company}>{item.job.company}</Text>
                        <Text style={styles.status}>Status: {item.status}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>You have not applied to any jobs yet.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f4f4f8",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2a9d8f",
        marginBottom: 20,
    },
    applicationCard: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    company: {
        fontSize: 16,
        color: "#2a9d8f",
    },
    status: {
        fontSize: 14,
        color: "#777",
        marginTop: 5,
    },
    emptyText: {
        fontSize: 16,
        color: "#777",
        textAlign: "center",
        marginTop: 20,
    },
});
