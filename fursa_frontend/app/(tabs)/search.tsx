import { Text, View, StyleSheet } from 'react-native';

export default function SearchScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Search page</Text>
        </View>
    );
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
});