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
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import MultiSelect from 'react-native-multiple-select';

const BASE_URL = 'http://192.168.1.103:8000/api'; // Replace with your backend URL

export default function ProfileScreen() {
    const [availableSkills, setAvailableSkills] = useState([]); // Skills fetched from the backend
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // Toggles between view and edit modes
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [resume, setResume] = useState<string | null>(null);
    const [profileId, setProfileId] = useState<number | null>(null);
    const router = useRouter();

    // Fetch profile and skills data
    useEffect(() => {
        const fetchProfileAndSkills = async () => {
            try {
                const token = await SecureStore.getItemAsync('authToken');
                if (!token) {
                    Alert.alert('Error', 'You are not logged in.');
                    router.push('/login');
                    return;
                }

                // Fetch profile data
                const profileResponse = await fetch(`${BASE_URL}/profiles/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    if (profileData.length > 0) {
                        const { id, name, bio, skills, profile_image, resume } = profileData[0];
                        setProfileId(id);
                        setName(name || '');
                        setBio(bio || '');
                        setSkills(skills || []);
                        setProfileImage(profile_image || null);
                        setResume(resume || null);
                    } else {
                        Alert.alert('Error', 'No profile found.');
                    }
                } else {
                    const errorData = await profileResponse.json();
                    Alert.alert('Error', errorData.detail || 'Failed to fetch profile data.');
                }

                // Fetch available skills
                const skillsResponse = await fetch(`${BASE_URL}/skills/`);
                if (skillsResponse.ok) {
                    const skillsData = await skillsResponse.json();
                    setAvailableSkills(skillsData.map(skill => ({ id: skill.id, name: skill.name })));
                } else {
                    Alert.alert('Error', 'Failed to fetch skills.');
                }
            } catch (error) {
                console.error('Error fetching profile or skills:', error);
                Alert.alert('Error', 'An unexpected error occurred while fetching your profile or skills.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfileAndSkills();
    }, []);

    // Upload profile image
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })
        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    // Upload resume
    const pickResume = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
            copyToCacheDirectory: true,
        });

        if (result.type === 'success') {
            setResume(result.uri);
            Alert.alert('Resume Selected', `Selected file: ${result.name}`);
        } else {
            Alert.alert('Upload Failed', 'No file was selected.');
        }
    };

    // Save profile
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

            // Append skills array as JSON string
            formData.append('skills', JSON.stringify(skills));

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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
                setIsEditing(false); // Switch to view mode after saving
            } else {
                const errorData = await response.json();
                console.error('Error Response:', errorData); // Debug error details
                Alert.alert('Update Failed', errorData.detail || 'Please try again.');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'An unexpected error occurred while saving your profile.');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#2a9d8f" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isEditing ? (
                <>
                    <TouchableOpacity onPress={pickImage}>
                        <Image
                            source={
                                profileImage
                                    ? { uri: profileImage }
                                    : require('../../assets/images/splash.png')
                            }
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Bio"
                        value={bio}
                        onChangeText={setBio}
                        multiline
                    />
                    <MultiSelect
                        items={availableSkills}
                        uniqueKey="id"
                        onSelectedItemsChange={setSkills}
                        selectedItems={skills}
                        selectText="Pick Skills"
                        searchInputPlaceholderText="Search Skills..."
                        tagRemoveIconColor="#2a9d8f"
                        tagBorderColor="#2a9d8f"
                        selectedItemTextColor="#2a9d8f"
                        selectedItemIconColor="#2a9d8f"
                        itemTextColor="#000"
                        displayKey="name"
                        searchInputStyle={{ color: '#000' }}
                        submitButtonColor="#2a9d8f"
                        submitButtonText="Submit"
                    />
                    <TouchableOpacity onPress={pickResume}>
                        <Text style={styles.uploadButton}>Upload Resume</Text>
                    </TouchableOpacity>
                    <Button title="Save Profile" onPress={saveProfile} color="#2a9d8f" />
                </>
            ) : (
                <>
                    <TouchableOpacity onPress={() => setIsEditing(true)}>
                        <Image
                            source={
                                profileImage
                                    ? { uri: profileImage }
                                    : require('../../assets/images/splash.png')
                            }
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                    <Text style={styles.text}>Name: {name}</Text>
                    <Text style={styles.text}>Bio: {bio}</Text>
                    <Text style={styles.text}>Skills: {skills.join(', ')}</Text>
                    {resume && (
                        <Text style={styles.text}>Resume: {resume.split('/').pop()}</Text>
                    )}
                    <Button title="Edit Profile" onPress={() => setIsEditing(true)} color="#2a9d8f" />
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
