import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    Image,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import MultiSelect from 'react-native-multiple-select';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const BASE_URL = 'http://192.168.1.103:8000/api';

export default function ProfileScreen() {
    const [availableSkills, setAvailableSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [profileId, setProfileId] = useState<number | null>(null);
    const router = useRouter();

    // Fetch profile and skills
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await SecureStore.getItemAsync('authToken');
                if (!token) {
                    Alert.alert('Error', 'You are not logged in.');
                    router.push('/login');
                    return;
                }

                // Fetch profile
                const profileResponse = await fetch(`${BASE_URL}/profiles/`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    const { id, name, bio, skills } = profileData[0];
                    setProfileId(id);
                    setName(name || '');
                    setBio(bio || '');
                    setSkills(skills.map((skill: any) => skill.id));
                } else {
                    Alert.alert('Error', 'Failed to fetch profile.');
                }

                // Fetch available skills
                const skillsResponse = await fetch(`${BASE_URL}/skills/`);
                if (skillsResponse.ok) {
                    const skillsData = await skillsResponse.json();
                    setAvailableSkills(skillsData.map((skill: any) => ({ id: skill.id, name: skill.name })));
                } else {
                    Alert.alert('Error', 'Failed to fetch skills.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const saveProfile = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            if (!token || !profileId) {
                Alert.alert('Error', 'You are not logged in.');
                return;
            }

            const response = await fetch(`${BASE_URL}/profiles/${profileId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name, bio, skill_ids: skills }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Profile updated.');
                setIsEditing(false);
            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.detail || 'Failed to save profile.');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isEditing ? (
                <>
                    <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
                    <TextInput style={styles.textArea} value={bio} onChangeText={setBio} placeholder="Bio" />
                    <MultiSelect
                        items={availableSkills}
                        uniqueKey="id"
                        onSelectedItemsChange={setSkills}
                        selectedItems={skills}
                        selectText="Select Skills"
                        searchInputPlaceholderText="Search Skills..."
                    />
                    <Button title="Save" onPress={saveProfile} />
                </>
            ) : (
                <>
                    <Text>Name: {name}</Text>
                    <Text>Bio: {bio}</Text>
                    <Text>Skills: {availableSkills.filter(skill => skills.includes(skill.id)).map(skill => skill.name).join(', ')}</Text>
                    <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
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
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
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
    uploadButton: {
        color: '#2a9d8f',
        textAlign: 'center',
        marginVertical: 10,
        textDecorationLine: 'underline',
    },
    text: {
        fontSize: 16,
        marginVertical: 5,
    },
});
