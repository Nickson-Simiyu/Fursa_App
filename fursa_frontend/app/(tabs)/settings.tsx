import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

const BASE_URL = 'http://192.168.1.103:8000/api'; // Replace with your backend URL

export default function SettingsScreen() {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileId, setProfileId] = useState(null); // Store profile ID dynamically
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const router = useRouter();

    // Fetch profile data when authenticated
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await SecureStore.getItemAsync('authToken');
                if (!token) {
                    setAuthenticated(false);
                    setLoading(false);
                    return;
                }
        
                setAuthenticated(true);
        
                const response = await fetch(`${BASE_URL}/profiles/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
        
                if (response.ok) {
                    const profileData = await response.json();
        
                    if (profileData.length > 0) {
                        const { id, name, bio, skills } = profileData[0]; // Extract ID and other fields
                        setProfileId(id); // Set the profile ID for subsequent API calls
                        setName(name || '');
                        setBio(bio || '');
                        setSkills(skills || '');
                    } else {
                        Alert.alert('Error', 'No profile data found.');
                    }
                } else {
                    const errorData = await response.json();
                    Alert.alert('Error', errorData.detail || 'Failed to fetch profile data.');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                Alert.alert('Error', 'An unexpected error occurred while fetching profile data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Save profile function
    const saveProfile = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            if (!token) {
                Alert.alert('Error', 'You are not logged in.');
                return;
            }
    
            if (!profileId) {
                Alert.alert('Error', 'Profile ID is missing.');
                return;
            }
    
            const response = await fetch(`${BASE_URL}/profiles/${profileId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, bio, skills }),
            });
    
            if (response.ok) {
                Alert.alert('Profile Saved', 'Your changes have been saved successfully.');
            } else {
                const errorData = await response.json();
                Alert.alert('Save Failed', errorData.detail || 'Please try again.');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'An unexpected error occurred while saving your profile.');
        }
    };

    // Logout function
    const handleLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('authToken');
            setAuthenticated(false);
            router.push('/login'); // Navigate to login page
            Alert.alert('Logged out successfully!');
        } catch (error) {
            console.error('Error logging out:', error);
            Alert.alert('Error', 'An error occurred while logging out. Please try again.');
        }
    };

    // Show loading spinner while fetching data
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#2a9d8f" />
            </View>
        );
    }

    // Render different views based on authentication status
    return (
        <View style={styles.container}>
            {authenticated ? (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Full-Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="About Me"
                        value={bio}
                        onChangeText={setBio}
                        multiline
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Skills"
                        value={skills}
                        onChangeText={setSkills}
                    />
                    <Button title="Save" onPress={saveProfile} color="#2a9d8f" />
                    <Button title="Logout" onPress={handleLogout} color="#ff4d4d" />
                </>
            ) : (
                <>
                    <Button
                        title="Login"
                        onPress={() => router.push('/login')}
                        color="#2a9d8f"
                    />
                    <Button
                        title="Sign Up"
                        onPress={() => router.push('/sign-up')}
                        color="#2a9d8f"
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
});
