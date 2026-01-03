import { useState, useEffect } from "react"
import { WorkspaceHeader } from "@/components/workspace-header"
import { RequestControls } from "@/components/request-controls"
import { RequestEditor } from "@/components/request-editor"
import { ResponseViewer } from "@/components/response-viewer"
import { useAppStore } from "@/store/useAppStore"
import { socket } from "@/services/socket"
import { SOCKET_EVENTS, IRoomState } from '@proxymity/shared';

function App() {
  const [roomId] = useState<string>("example-room-id");
  const activeUsers = useAppStore((state) => state.activeUsers);

  const setResponse = useAppStore((state) => state.setResponse);
  const setLoading = useAppStore((state) => state.setLoading);
  const setRequest = useAppStore((state) => state.setRequest);
  const setMethod = useAppStore((state) => state.setMethod);
  const setUrl = useAppStore((state) => state.setUrl);
  const setBody = useAppStore((state) => state.setBody);
  const setActiveUsers = useAppStore((state) => state.setActiveUsers);
  const setHeaders = useAppStore((state) => state.setHeaders);
  const setQueryParams = useAppStore((state) => state.setQueryParams);

  useEffect(() => {
    const onConnect = () => {
      console.log("Connected to socket server with ID:", socket.id);
      socket.emit(SOCKET_EVENTS.CLIENT.JOIN_ROOM, roomId);
    };

    const onDisconnect = () => {
      console.log("Disconnected from socket server");
      socket.emit(SOCKET_EVENTS.CLIENT.LEAVE_ROOM, roomId);
    };

    const onSyncState = (roomState: IRoomState) => {
      console.log("Received state from server:", roomState);
      setRequest(roomState.request);
    };

    const onBroadcastChange = (updatedData: { field: string, value: any }) => {
      console.log("Received broadcasted change:", updatedData);
      switch (updatedData.field) {
        case 'method': setMethod(updatedData.value); break;
        case 'url': setUrl(updatedData.value); break;
        case 'body': setBody(updatedData.value); break;
        case 'headers': setHeaders(updatedData.value); break;
        case 'queryParams': setQueryParams(updatedData.value); break;
      }
    };

    const onRequestStarted = () => {
      setLoading(true);
    }

    const onRequestComplete = (response: any) => {
      setResponse(response);
      setLoading(false);
    }

    // const onError = (errorMessage: string) => {
    //   console.error("Socket error:", errorMessage);
    // };

    const onUserCount = (count: number) => {
      setActiveUsers(count);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on(SOCKET_EVENTS.SERVER.SYNC_STATE, onSyncState);
    socket.on(SOCKET_EVENTS.SERVER.BROADCAST_CHANGE, onBroadcastChange);
    socket.on(SOCKET_EVENTS.SERVER.REQUEST_STARTED, onRequestStarted);
    socket.on(SOCKET_EVENTS.SERVER.REQUEST_COMPLETE, onRequestComplete);
    // socket.on(SOCKET_EVENTS.SERVER.ERROR, onError);
    socket.on(SOCKET_EVENTS.SERVER.USER_COUNT, onUserCount);
    
    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(SOCKET_EVENTS.SERVER.SYNC_STATE, onSyncState);
      socket.off(SOCKET_EVENTS.SERVER.BROADCAST_CHANGE, onBroadcastChange);
      socket.off(SOCKET_EVENTS.SERVER.REQUEST_STARTED, onRequestStarted);
      socket.off(SOCKET_EVENTS.SERVER.REQUEST_COMPLETE, onRequestComplete);
      // socket.off(SOCKET_EVENTS.SERVER.ERROR, onError);
      socket.off(SOCKET_EVENTS.SERVER.USER_COUNT, onUserCount);
      socket.disconnect();
    };
  }, []);

  const handleSendRequest = async () => {
    const currentRequest = useAppStore.getState().request;
    console.log("Sending request:", currentRequest);
    socket.emit(SOCKET_EVENTS.CLIENT.EXECUTE_REQUEST, { roomId });
  }


  return (
    <div className="flex h-screen flex-col bg-background">
      <WorkspaceHeader roomId={roomId} activeUsers={activeUsers} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <RequestControls
          roomId={roomId}
          onSend={handleSendRequest}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/2 border-r border-border overflow-hidden">
            <RequestEditor
              roomId={roomId}
            />
          </div>

          <div className="w-1/2 overflow-hidden">
            <ResponseViewer/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;