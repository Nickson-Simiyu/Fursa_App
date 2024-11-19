import { Tabs, Stack } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffd33d',
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
                name="Applications"
                options={{
                    title: 'Applications',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'briefcase' : 'briefcase-outline'} color={color} size={24} />
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
