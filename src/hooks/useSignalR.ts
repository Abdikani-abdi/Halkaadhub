import { useEffect, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuthStore } from '@/stores/authStore';
import { HUBS_URL } from '@/config/api';

type HubName = 'chat' | 'notifications';

export function useSignalR(hubName: HubName) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${HUBS_URL}/${hubName}`, {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    connection.start().catch((err) => {
      console.error(`[SignalR] Failed to connect to ${hubName}:`, err);
    });

    return () => {
      connection.stop();
      connectionRef.current = null;
    };
  }, [accessToken, hubName]);

  const on = useCallback(
    (event: string, handler: (...args: unknown[]) => void) => {
      connectionRef.current?.on(event, handler);
      return () => {
        connectionRef.current?.off(event, handler);
      };
    },
    []
  );

  const invoke = useCallback(
    async (method: string, ...args: unknown[]) => {
      if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
        await connectionRef.current.invoke(method, ...args);
      }
    },
    []
  );

  return { connection: connectionRef, on, invoke };
}
