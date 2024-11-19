import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router"; 
import { MaterialIcons } from '@expo/vector-icons';

const BASE_URL = 'http://192.168.1.101:8000/api';

export default function ProfileScreen() {
    const [authenticated, setAuthenticated] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = await SecureStore.getItemAsync('authToken');
                if (token) {
                    setAuthenticated(true);
                    const response = await fetch(`${BASE_URL}/profile/`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setName(userData.name || 'No Name');
                        setBio(userData.bio || 'Bio not set');
                        setSkills(userData.skills || 'No skills added');
                        setProfileImage(userData.profileImage || null);
                    } else {
                        Alert.alert('Error', 'Failed to fetch profile data.');
                    }
                } else {
                    setAuthenticated(false);
                    router.push('/settings'); // Navigate to settings
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                Alert.alert('Error', 'An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [router]);

    // Handle image picking
    const handlePickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                setProfileImage(uri);
                await uploadProfileImage(uri);
            }
        } catch (error) {
            console.error('Error selecting image:', error);
            Alert.alert('Error', 'An error occurred while selecting an image.');
        }
    };

    // Upload image to the server
    const uploadProfileImage = async (uri: string) => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            if (!token) return;

            const formData = new FormData();
            formData.append('profileImage', {
                uri,
                name: 'profile.jpg',
                type: 'image/jpeg',
            });

            const response = await fetch(`${BASE_URL}/profile/upload/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (response.ok) {
                Alert.alert('Success', 'Profile image updated successfully.');
            } else {
                Alert.alert('Error', 'Failed to upload profile image.');
            }
        } catch (error) {
            console.error('Error uploading profile image:', error);
            Alert.alert('Error', 'An error occurred during the upload.');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#2a9d8f" />
            </View>
        );
    }

    return authenticated ? (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.profileImage}
                    source={profileImage ? { uri: profileImage } : require('../../assets/images/splash.png')}
                />
                <TouchableOpacity style={styles.editIcon} onPress={handlePickImage}>
                    <MaterialIcons name="camera-alt" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.bio}>{bio}</Text>
            <Text style={styles.skills}>{skills}</Text>
            <Button title="Edit Profile" onPress={() => router.push('/settings')} />
        </View>
    ) : null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    imageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#2a9d8f',
        padding: 6,
        borderRadius: 50,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    bio: {
        fontSize: 16,
        color: '#555',
        marginVertical: 8,
    },
    skills: {
        fontSize: 16,
        color: '#555',
    },
});
