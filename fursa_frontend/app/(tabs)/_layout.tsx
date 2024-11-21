import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#2a9d8f",
            }}
        >
        <Tabs.Screen
            name="index"
            options={{
                title: 'Home',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                ),
            }} />
        <Tabs.Screen
            name="jobs"
            options={{
                title: 'Jobs',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'briefcase' : 'briefcase-outline'} color={color} size={24} />
                ),
            }} />
        <Tabs.Screen
            name="applications"
            options={{
                title: 'Applications',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'document-text' : 'document-text-outline'} color={color} size={24} />
                ),
            }} />
        <Tabs.Screen
            name="profile"
            options={{
                title: 'Profile',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
                ),
            }} />
        <Tabs.Screen
            name="settings"
            options={{
                title: 'Settings',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
                ),
            }} />
        </Tabs>
    );
}
