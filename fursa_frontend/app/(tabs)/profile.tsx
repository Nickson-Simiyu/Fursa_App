import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TextInput, Button, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';

interface DocumentAsset {
    uri: string;
    name: string;
    mimeType: string;
    size: number;
}

export default function ProfileScreen() {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [resume, setResume] = useState<{ name: string; uri: string } | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Profile fields
    const [name, setName] = useState('');
    const [skills, setSkills] = useState('');
    const [bio, setBio] = useState('');

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
            type: "application/pdf",
            copyToCacheDirectory: true
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedFile = result.assets[0] as DocumentAsset; // Type assertion
            setResume({ name: selectedFile.name, uri: selectedFile.uri });
            Alert.alert("Resume Uploaded", `Selected file: ${selectedFile.name}`);
        } else {
            Alert.alert("Upload Failed", "No file was selected.");
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

    // Render PDF Viewer Modal
    const renderPdfModal = () => (
        <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={{ flex: 1 }}>
                {resume ? (
                    <>
                        {loadingPDF && <ActivityIndicator size="large" color="#2a9d8f" style={styles.loader} />}
                        <WebView
                            source={{ uri: resume.uri }}
                            onLoadStart={() => setLoadingPDF(true)}
                            onLoad={() => setLoadingPDF(false)}
                            onError={(error) => {
                                setLoadingPDF(false);
                                Alert.alert("Error", "Unable to display PDF. Please try again.");
                                console.error(error);
                            }}
                            style={{ flex: 1 }}
                        />
                    </>
                ) : (
                    <Text style={styles.noResumeText}>No resume available to display.</Text>
                )}
                <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
        </Modal>
    );

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
                        style={[styles.input, styles.textArea]}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="About Me"
                        multiline
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your skills (e.g., JavaScript, Design)"
                        value={skills}
                        onChangeText={setSkills}
                    />
                    <Button title="Save" onPress={saveProfile} />
                </>
            ) : (
                <>
                    <TouchableOpacity onPress={toggleEditMode}>
                        <Text style={styles.sectionTitle}>Edit Profile</Text>
                    </TouchableOpacity>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Full name</Text>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.sectionTitle}>About Me</Text>
                        <Text style={styles.description}>{bio}</Text>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <Text style={styles.info}>{skills}</Text>
                    </View>
                </>
            )}

            {/* Resume Section */}
            <View style={styles.resumeSection}>
                <Text style={styles.sectionTitle}>Resume</Text>
                {resume ? (
                    <View style={styles.resumeContainer}>
                        <Text style={styles.resumeText}>Uploaded: {resume.name}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Text style={styles.viewButton}>View Resume</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={styles.resumeText}>No resume uploaded</Text>
                )}
                <Button title="Upload Resume" onPress={pickResume} />
                {renderPdfModal()}
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
        alignItems: 'center',
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
    loader: {
        position: 'absolute',
        top: '50%',
        alignSelf: 'center',
    },
    noResumeText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginVertical: 20,
    },
});
