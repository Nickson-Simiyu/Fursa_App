import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const BASE_URL = 'http://192.168.1.103:8000/api'; // Replace with your backend URL

export default function SignUpScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignUp = async () => {
        if (!username || !email || !password) {
            Alert.alert('Validation Error', 'All fields are required.');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                Alert.alert('Sign-Up Successful', 'You can now log in.');
                router.push('/login');
            } else {
                const errorData = await response.json();
                const errorMessage =
                    errorData?.email?.[0] || // Check for email-specific errors
                    errorData?.username?.[0] || // Check for username-specific errors
                    errorData?.non_field_errors?.[0] || // General errors
                    'Sign-Up failed. Please try again.';
                Alert.alert('Sign-Up Failed', errorMessage);
            }
        } catch (error) {
            console.error('Error during sign-up:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
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
                placeholder="Email"
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
            <Button title="Sign Up" onPress={handleSignUp} color="#2a9d8f" />
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