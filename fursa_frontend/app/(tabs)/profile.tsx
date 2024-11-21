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
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [resume, setResume] = useState<string | null>(null);
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
                    const { id, name, bio, skills, profile_image, resume } = profileData[0];
                    setProfileId(id);
                    setName(name || '');
                    setBio(bio || '');
                    setSkills(skills.map((skill: any) => skill.id));
                    setProfileImage(profile_image || null);
                    setResume(resume || null);
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

    // Upload profile image
    const pickImage = async () => {
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

    const pickResume = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
        });
        if (result.type === 'success') {
            setResume(result.uri);
            Alert.alert('Resume Selected', `Selected file: ${result.name}`);
        } else {
            Alert.alert('Upload Failed', 'No file was selected.');
        }
    };

    const saveProfile = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            if (!token || !profileId) {
                Alert.alert('Error', 'You are not logged in.');
                return;
            }
            
            const formData = new FormData();
            formData.append('name', name);
            formData.append('bio', bio);
            formData.append('skill_ids', JSON.stringify(skills));

            if (profileImage) {
                const fileType = profileImage.split('.').pop();
                formData.append('profile_image', {
                    uri: profileImage,
                    name: `profile.${fileType}`,
                    type: `image/${fileType}`,
                } as any);
            }

            if (resume) {
                const fileType = resume.split('.').pop();
                formData.append('resume', {
                    uri: resume,
                    name: `resume.${fileType}`,
                    type: 'application/pdf',
                } as any);
            }

            const response = await fetch(`${BASE_URL}/profiles/${profileId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData),
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
                    <TouchableOpacity onPress={pickImage}>
                        <Image
                            source={profileImage ? { uri: profileImage } : require('../../assets/images/splash.png')}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
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
                    <TouchableOpacity onPress={pickResume}>
                        <Text style={styles.uploadButton}>Upload Resume</Text>
                    </TouchableOpacity>
                    <Button title="Save" onPress={saveProfile} />
                </>
            ) : (
                <>
                    <Image
                        source={profileImage ? { uri: profileImage } : require('../../assets/images/splash.png')}
                        style={styles.profileImage}
                    />
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
