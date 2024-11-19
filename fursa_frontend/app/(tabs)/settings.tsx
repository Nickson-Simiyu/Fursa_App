import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const router = useRouter();

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await SecureStore.getItemAsync('authToken');
                setAuthenticated(!!token);
            } catch (error) {
                console.error('Error checking authentication:', error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    // Save profile function
    const saveProfile = () => {
        // Save profile logic
        console.log({ name, bio, skills });
        Alert.alert('Profile Saved', 'Your changes have been saved successfully.');
    };

    // Logout function
    const handleLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('authToken');
            setAuthenticated(false);
            Alert.alert('Logged out successfully!');
        } catch (error) {
            console.error('Error logging out:', error);
            Alert.alert('Error', 'An error occurred while logging out. Please try again.');
        }
    };

    // Show loading spinner while checking authentication
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
                        placeholder="Name"
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
                    <Button title="Save" onPress={saveProfile} />
                    <Button title="Logout" onPress={handleLogout} color="#2a9d8f" />
                </>
            ) : (
                <>
                    <Button
                        title="Login"
                        onPress={() => router.push('/login')} // Navigate to the login page
                        color="#2a9d8f"
                    />
                    <Button
                        title="Sign up"
                        onPress={() => router.push('/sign-up')} // Navigate to the login page
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
