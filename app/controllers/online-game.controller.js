// app/controller/online-game.controller.js

import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { SocketContext } from '../contexts/socket.context';
import Board from "../components/board/board.component";


export default function OnlineGameController({ navigation }) {

    const socket = useContext(SocketContext);

    const [inQueue, setInQueue] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [idOpponent, setIdOpponent] = useState(null);

    useEffect(() => {
        console.log('[emit][queue.join]:', socket.id);
        socket.emit("queue.join");
        setInQueue(false);
        setInGame(false);

        socket.on('queue.added', (data) => {
            console.log('[listen][queue.added]:', data);
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
        });

        socket.on('game.start', (data) => {
            console.log('[listen][game.start]:', data);
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
            setIdOpponent(data['idOpponent']);
        });

        socket.on('queue.left', (data) => {
            console.log('[listen][queue.left]:', data);
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
            navigation.navigate('HomeScreen');
        });

        socket.on('game.over', (data) => {
            console.log('[listen][game.over]:', data);
            if (data.isWinner) {
                console.log('Navigation vers GameWon');
                navigation.navigate('GameWon', {
                    player1Score: data.player1Score,
                    player2Score: data.player2Score
                });
            } else {
                console.log('Navigation vers GameLost');
                navigation.navigate('GameLost', {
                    player1Score: data.player1Score,
                    player2Score: data.player2Score
                });
            }
        });

        return () => {
            if (socket) {
                socket.off('queue.added');
                socket.off('game.start');
                socket.off('queue.left');
                socket.off('game.over');
            }
        };
    }, [socket, navigation]);

    return (
        <View style={styles.container}>
            {!inQueue && !inGame && (
                <>
                    <Text style={styles.paragraph}>
                        Waiting for server datas...
                    </Text>
                </>
            )}

            {inQueue && (
                <>
                    <Text style={styles.paragraph}>
                        Waiting for another player...
                    </Text>
                    <View>
                        <Button
                            title="Quittez la file d'attente"
                            onPress={() => {socket.emit("queue.leave")}
                            }
                        />
                    </View>
                </>
            )}

            {inGame && (
                <>
                    <Board />
                </>


            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        height: '100%',
    },
    paragraph: {
        fontSize: 16,
    }
});
