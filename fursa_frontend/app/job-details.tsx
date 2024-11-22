import React, { useState } from "react";
import {
    Text,
    StyleSheet,
    ScrollView,
    Button,
    Alert,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

const BASE_URL = "http://192.168.1.103:8000/api";

export default function JobDetailsScreen() {
    const { job } = useLocalSearchParams();
    const jobDetails = job ? JSON.parse(job) : {};

    const [coverLetter, setCoverLetter] = useState("");
    const [resume, setResume] = useState(null);

    const handleUploadResume = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
                copyToCacheDirectory: true,
            });
    
            console.log("Document Picker Result:", result); // Debug log
    
            if (result.type === "success") {
                const file = result.assets ? result.assets[0] : result;
            
                // Validate if the file exists and is a PDF
                const fileInfo = await FileSystem.getInfoAsync(file.uri);
                if (fileInfo.exists && file.mimeType === "application/pdf") {
                    setResume({
                        uri: file.uri,
                        name: file.name,
                        type: file.mimeType || "application/pdf",
                    });
                    Alert.alert("Resume Selected", `Selected file: ${file.name}`);
                } else {
                    Alert.alert("Error", "Please select a valid PDF file.");
                    console.error("File does not exist at URI:", file.uri);
                }
            }
        } catch (error) {
            console.error("Error selecting resume:", error);
            Alert.alert("Error", "An unexpected error occurred while selecting a resume.");
        }
    };


    const handleApply = async (jobId) => {
        try {
            if (!resume) {
                Alert.alert("No File Selected", "Please select a resume before applying.");
                return;
            }
    
            const token = await SecureStore.getItemAsync("authToken");
            if (!token) {
                Alert.alert("Error", "You are not logged in.");
                return;
            }
    
            const formData = new FormData();
            formData.append("job", jobId);
            formData.append("cover_letter", coverLetter);
            formData.append("resume", {
                uri: resume.uri,
                name: resume.name,
                type: resume.type,
            });
    
            console.log("FormData Contents:", {
                job: jobId,
                cover_letter: coverLetter,
                resume,
            });
    
            const response = await fetch(`${BASE_URL}/applications/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
    
            if (response.ok) {
                Alert.alert("Application Successful", "You have applied for this job.");
            } else {
                const errorData = await response.json();
                console.error("Error Response:", errorData);
                Alert.alert("Error", errorData.detail || "Failed to apply for this job.");
            }
        } catch (error) {
            console.error("Error applying for job:", error);
            Alert.alert("Error", "An unexpected error occurred.");
        }
    };
    

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{jobDetails.title}</Text>
            <Text style={styles.company}>{jobDetails.company}</Text>
            <Text style={styles.location}>{jobDetails.location}</Text>
            <Text style={styles.description}>{jobDetails.description}</Text>
            <Text style={styles.requirementsTitle}>Requirements:</Text>
            <Text style={styles.requirements}>{jobDetails.requirements}</Text>

            {/* Cover Letter Input */}
            <TextInput
                style={styles.textArea}
                placeholder="Write your cover letter here..."
                value={coverLetter}
                onChangeText={setCoverLetter}
                multiline
            />

            {/* Resume Upload Button */}
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadResume}>
                <Text style={styles.uploadButtonText}>
                    {resume ? `Selected: ${resume.name}` : "Upload Resume"}
                </Text>
            </TouchableOpacity>

            {/* Apply Button */}
            <Button 
                title="Apply for this Job" 
                onPress={() => handleApply(jobDetails.id)} 
                color="#2a9d8f" 
                disabled={!resume || !coverLetter}
            />
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
    textArea: {
        height: 100,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        textAlignVertical: "top",
    },
    uploadButton: {
        backgroundColor: "#2a9d8f",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 15,
    },
    uploadButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});