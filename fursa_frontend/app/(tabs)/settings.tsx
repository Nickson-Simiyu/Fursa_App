import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Check authentication status
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

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#2a9d8f" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {authenticated ? (
                <>
                    <Button
                        title="Profile Settings"
                        onPress={() => router.push('/profile')}
                        color="#2a9d8f"
                    />
                    <Button
                        title="App Preferences"
                        onPress={() => router.push('/preferences')} // Navigate to a future settings page
                        color="#2a9d8f"
                    />
                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        color="#ff4d4d"
                    />
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
});
