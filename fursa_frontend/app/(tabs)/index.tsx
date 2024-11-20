import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from "react-native";

const BASE_URL = "http://192.168.1.103:8000/api"; // Replace with your backend URL

export default function Index() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(`${BASE_URL}/jobs/`); // Endpoint for fetching jobs
                if (response.ok) {
                    const data = await response.json();
                    setJobs(data); // Set the job list to state
                } else {
                    console.error("Failed to fetch jobs");
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
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
            <FlatList
                data={jobs}
                keyExtractor={(item) => item.id.toString()} // Use job ID as key
                renderItem={({ item }) => (
                    <View style={styles.jobCard}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.company}>{item.company}</Text>
                        <Text style={styles.location}>{item.location}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No jobs available</Text>
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
    jobCard: {
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
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    company: {
        fontSize: 16,
        color: "#2a9d8f",
        marginBottom: 5,
    },
    location: {
        fontSize: 14,
        color: "#777",
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: "#555",
    },
    emptyText: {
        fontSize: 16,
        color: "#777",
        textAlign: "center",
        marginTop: 20,
    },
});
