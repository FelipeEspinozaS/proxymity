import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS, HttpMethod, IKeyValue } from '@proxymity/shared';
import { stateStore } from '../services/state-store';


const handleJoinRoom = (io: Server, socket: Socket, roomId: string) => {
  socket.join(roomId);
  
  const currentState = stateStore.getOrCreateRoom(roomId);
  socket.emit(SOCKET_EVENTS.SERVER.SYNC_STATE, currentState);
  
  const userCount = io.sockets.adapter.rooms.get(roomId)?.size || 0;
  io.to(roomId).emit(SOCKET_EVENTS.SERVER.USER_COUNT, userCount);
  
  console.log(`[Room] ${socket.id} joined ${roomId}. State synced.`);
};


const handleDisconnecting = (io: Server, socket: Socket) => {
  for (const roomId of socket.rooms) {
    if (roomId !== socket.id) {
      const currentCount = io.sockets.adapter.rooms.get(roomId)?.size || 1;
      io.to(roomId).emit(SOCKET_EVENTS.SERVER.USER_COUNT, currentCount - 1);
    }
  }
};

const handleUpdateMethod = (socket: Socket, roomId: string, method: HttpMethod) => {
  stateStore.updateMethod(roomId, method);
  socket.to(roomId).emit(SOCKET_EVENTS.SERVER.BROADCAST_CHANGE, { field: 'method', value: method });
};

const handleUpdateUrl = (socket: Socket, roomId: string, url: string) => {
  stateStore.updateUrl(roomId, url);
  socket.to(roomId).emit(SOCKET_EVENTS.SERVER.BROADCAST_CHANGE, { field: 'url', value: url });
};

const handleUpdateHeaders = (socket: Socket, roomId: string, headers: IKeyValue[]) => {
  stateStore.updateKeyValueList(roomId, 'headers', headers);
  socket.to(roomId).emit(SOCKET_EVENTS.SERVER.BROADCAST_CHANGE, { field: 'headers', value: headers });
};

const handleUpdateParams = (socket: Socket, roomId: string, params: IKeyValue[]) => {
  stateStore.updateKeyValueList(roomId, 'queryParams', params);
  socket.to(roomId).emit(SOCKET_EVENTS.SERVER.BROADCAST_CHANGE, { field: 'queryParams', value: params });
};

const handleUpdateBody = (socket: Socket, roomId: string, body: string) => {
  stateStore.updateBody(roomId, body);
  socket.to(roomId).emit(SOCKET_EVENTS.SERVER.BROADCAST_CHANGE, { field: 'body', value: body });
};

export const registerRoomHandlers = (io: Server, socket: Socket) => {
  socket.on(SOCKET_EVENTS.CLIENT.JOIN_ROOM, (roomId: string) => {
    handleJoinRoom(io, socket, roomId);
  });

  socket.on('disconnecting', () => {
    handleDisconnecting(io, socket);
  });
  
  socket.on(SOCKET_EVENTS.CLIENT.UPDATE_METHOD, ({ roomId, method }) => {
    handleUpdateMethod(socket, roomId, method);
  });

  socket.on(SOCKET_EVENTS.CLIENT.UPDATE_URL, ({ roomId, url }) => {
    handleUpdateUrl(socket, roomId, url);
  });

  socket.on(SOCKET_EVENTS.CLIENT.UPDATE_HEADERS, ({ roomId, headers }) => {
    handleUpdateHeaders(socket, roomId, headers);
  });

  socket.on(SOCKET_EVENTS.CLIENT.UPDATE_PARAMS, ({ roomId, params }) => {
    handleUpdateParams(socket, roomId, params);
  });

  socket.on(SOCKET_EVENTS.CLIENT.UPDATE_BODY, ({ roomId, body }) => {
    handleUpdateBody(socket, roomId, body);
  });
};