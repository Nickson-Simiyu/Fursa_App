import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [resume, setResume] = useState<{ name: string; uri: string } | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Profile fields
    const [name, setName] = useState("John Doe");
    const [jobTitle, setJobTitle] = useState("Software Developer");
    const [location, setLocation] = useState("Mombasa, Kenya");
    const [bio, setBio] = useState("Passionate developer with 3+ years of experience in mobile and web app development.");

    // Image Picker Function
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission Denied", "You need to grant camera permissions to upload a photo.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    // Document Picker for Resume
    const pickResume = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: "application/pdf", // Limit to PDF files; use "*/*" for all file types
            copyToCacheDirectory: true
        });

        if (result.type === "success") {
            setResume({ name: result.name, uri: result.uri });
            Alert.alert("Resume Uploaded", `Selected file: ${result.name}`);
        }
    };

    // Toggle Edit Mode
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    // Save Profile
    const saveProfile = () => {
        setIsEditing(false);
        Alert.alert("Profile Updated", "Your profile has been successfully updated!");
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.profileImage}
                    source={profileImage ? { uri: profileImage } : require('../../assets/images/splash.png')}
                />
                <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                    <MaterialIcons name="camera-alt" size={24} color="white" />
                </TouchableOpacity>
            </View>
            
            {isEditing ? (
                <>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Name"
                    />
                    <TextInput
                        style={styles.input}
                        value={jobTitle}
                        onChangeText={setJobTitle}
                        placeholder="Job Title"
                    />
                    <TextInput
                        style={styles.input}
                        value={location}
                        onChangeText={setLocation}
                        placeholder="Location"
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="About Me"
                        multiline
                    />
                    <Button title="Save" onPress={saveProfile} />
                </>
            ) : (
                <>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.info}>{jobTitle}</Text>
                    <Text style={styles.info}>{location}</Text>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About Me</Text>
                        <Text style={styles.description}>{bio}</Text>
                    </View>
                </>
            )}

            {/* Resume Section */}
            <View style={styles.resumeSection}>
                <Text style={styles.sectionTitle}>Resume</Text>
                {resume ? (
                    <View style={styles.resumeContainer}>
                        <Text style={styles.resumeText}>Uploaded: {resume.name}</Text>
                        <TouchableOpacity onPress={() => Alert.alert("Open Resume", `Opening: ${resume.name}`)}>
                            <Text style={styles.viewButton}>View Resume</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={styles.resumeText}>No resume uploaded</Text>
                )}
                <Button title="Upload Resume" onPress={pickResume} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: '#f4f4f8',
    },
    imageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        backgroundColor: '#e1e1e1',
    },
    editIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#2a9d8f',
        padding: 6,
        borderRadius: 50,
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    info: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    section: {
        width: '100%',
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2a9d8f',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginVertical: 8,
    },
    resumeSection: {
        width: '100%',
        padding: 20,
        marginTop: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
    },
    resumeContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    resumeText: {
        fontSize: 16,
        color: '#333',
    },
    viewButton: {
        fontSize: 16,
        color: '#2a9d8f',
        marginTop: 4,
        textDecorationLine: 'underline',
    },
});
