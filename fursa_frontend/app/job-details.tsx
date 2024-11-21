import React from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router"; // Corrected hook

export default function JobDetailsScreen() {
    const { job } = useLocalSearchParams(); // Corrected hook
    const jobDetails = job ? JSON.parse(job) : {}; // Parse job data or fallback to empty object

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{jobDetails.title}</Text>
            <Text style={styles.company}>{jobDetails.company}</Text>
            <Text style={styles.location}>{jobDetails.location}</Text>
            <Text style={styles.description}>{jobDetails.description}</Text>
            <Text style={styles.requirementsTitle}>Requirements:</Text>
            <Text style={styles.requirements}>{jobDetails.requirements}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f4f4f8",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    company: {
        fontSize: 18,
        color: "#2a9d8f",
        marginBottom: 5,
    },
    location: {
        fontSize: 16,
        color: "#777",
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: "#555",
        marginBottom: 10,
    },
    requirementsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginTop: 15,
    },
    requirements: {
        fontSize: 16,
        color: "#555",
    },
});
