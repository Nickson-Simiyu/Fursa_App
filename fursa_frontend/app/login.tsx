import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const BASE_URL = 'http://127.0.0.1:8000/api'; // Replace with your backend URL

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await fetch(`${BASE_URL}/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                await SecureStore.setItemAsync('authToken', data.token);

                // Save user details locally if needed
                const { email } = data.user; // Assuming the backend returns email
                console.log({ username, email });

                Alert.alert('Login Successful', 'You are now logged in.');
                router.push('/settings'); // Redirect to settings/profile page
            } else {
                Alert.alert('Login Failed', 'Invalid username or password.');
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
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
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
