import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const BASE_URL = 'http://192.168.1.103:8000/api'; // Replace with your backend URL

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await fetch(`${BASE_URL}/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }), // Send `email` and `password`
            });
    
            if (response.ok) {
                const data = await response.json();
                const accessToken = data.access_token; // Extract the access token
    
                // SecureStore requires string values, so we store the token as-is
                await SecureStore.setItemAsync('authToken', String(accessToken));
    
                Alert.alert('Login Successful', 'You are now logged in.');
                console.log('Navigating to /sign-up'); // Log for debugging
                router.push('./(tabs)'); // Navigate after login
            } else {
                const errorData = await response.json();
                Alert.alert('Login Failed', errorData.error || 'Invalid email or password.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            Alert.alert('Error', 'An unexpected error occurred.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} color="#2a9d8f" />
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
});