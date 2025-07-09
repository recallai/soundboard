"use client";

import { useState, useEffect, useCallback } from 'react';

interface PlaySoundboardState {
    message: string;
    isConnected: boolean;
    clientId: string | null;
    isReconnecting: boolean;
    reconnectAttempts: number;
}

export function usePlaySoundboard() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [state, setState] = useState<PlaySoundboardState>({
        message: 'Connecting to server...',
        isConnected: false,
        clientId: null,
        isReconnecting: false,
        reconnectAttempts: 0
    });

    const createWebSocketConnection = useCallback(() => {
        const clientId = new URL(window.location.href).searchParams.get('clientId');
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${protocol}//${window.location.host}/ws/client?clientId=${clientId}`);

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
            setState(prevState => ({
                ...prevState,
                message: 'Connected to server.',
                isConnected: true,
                isReconnecting: false,
                reconnectAttempts: 0
            }));
            ws.send(JSON.stringify({
                type: 'log',
                payload: `Client connected`
            }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            console.log('Received message from server:', data);

            if (data.type === 'registered') {
                console.log('Registered with clientId:', data.payload.clientId);
            } else if (data.type === 'audio' && data.payload.audioUrl) {
                const audio = new Audio(data.payload.audioUrl);
                audio.play();
                setState(prevState => ({ ...prevState, message: 'Playing sound!' }));
            } else if (data.type === 'error') {
                setState((prevState) => ({
                    ...prevState,
                    message: `Error: ${data.payload.message}`
                }));
            }
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
            attemptReconnect();
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setState({
                message: 'Connection error.',
                isConnected: false,
                clientId: null,
                isReconnecting: false,
                reconnectAttempts: 0
            });
        };

        return ws;
    }, []);

    const attemptReconnect = useCallback(() => {
        setState(prevState => {
            const newAttempts = prevState.reconnectAttempts + 1;
            const maxAttempts = 60; // 1 minute of attempts

            if (newAttempts > maxAttempts) {
                return {
                    ...prevState,
                    message: 'Connection lost. Please refresh.',
                    isConnected: false,
                    isReconnecting: false,
                    reconnectAttempts: newAttempts
                };
            }

            return {
                ...prevState,
                message: `Reconnecting... (${newAttempts}/${maxAttempts})`,
                isConnected: false,
                isReconnecting: true,
                reconnectAttempts: newAttempts
            };
        });

        // Only attempt reconnect if we haven't exceeded max attempts
        setTimeout(() => {
            setState(prevState => {
                if (prevState.reconnectAttempts <= 60 && prevState.isReconnecting) {
                    const newWs = createWebSocketConnection();
                    setSocket(newWs);
                }
                return prevState;
            });
        }, 1000); // 1 second delay
    }, [createWebSocketConnection]);

    useEffect(() => {
        try {
            const ws = createWebSocketConnection();
            setSocket(ws);

            return () => {
                ws.close();
            };
        } catch (error) {
            if (error instanceof Error) {
                setState({
                    message: error.message,
                    isConnected: false,
                    clientId: null,
                    isReconnecting: false,
                    reconnectAttempts: 0
                });
                console.error({ message: 'Bot failed to connect to server', error: error.message });
            }
        }
    }, [createWebSocketConnection]);

    return { ...state, socket };
} 