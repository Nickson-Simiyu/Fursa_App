import { Tabs } from "expo-router";
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
                    }}
            />
            <Tabs.Screen 
                name="search" 
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'search' : 'search-outline'} color={color} size={24} />
                    ),
                    }}
            />
            <Tabs.Screen
                name="saved_jobs"
                options={{
                    title: 'Saved Jobs',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Applications"
                options={{
                    title: 'Applications',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'briefcase' : 'briefcase-outline'} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
                    ),
                }}
            />
        </Tabs>
    );
}
