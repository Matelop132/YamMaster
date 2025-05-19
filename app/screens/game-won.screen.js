import React, { useContext } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { SocketContext } from '../contexts/socket.context';

export default function GameWonScreen({ route, navigation }) {
    const socket = useContext(SocketContext);
    const { player1Score, player2Score } = route.params;

    const handleRestart = () => {
        socket.emit('game.restart');
        navigation.navigate('OnlineGame');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Félicitations !</Text>
            <Text style={styles.subtitle}>Vous avez gagné !</Text>
            
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Votre score : {player1Score}</Text>
                <Text style={styles.scoreText}>Score de l'adversaire : {player2Score}</Text>
            </View>

            <Button 
                title="Rejouer" 
                onPress={handleRestart}
                style={styles.button}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#4CAF50",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 24,
        color: "#666",
        marginBottom: 30,
    },
    scoreContainer: {
        marginBottom: 40,
        alignItems: "center",
    },
    scoreText: {
        fontSize: 18,
        marginVertical: 5,
    },
    button: {
        marginTop: 20,
    }
}); 