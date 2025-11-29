// /packages/shared/src/events.ts

export const SOCKET_EVENTS = {
  // Eventos que envía el CLIENTE
  CLIENT: {
    JOIN_ROOM: 'client:join_room',       // "Quiero entrar a la sala X"
    UPDATE_FIELD: 'client:update_field', // "Cambié la URL"
    UPDATE_BODY: 'client:update_body',   // "Escribí en el editor JSON"
    ADD_HEADER: 'client:add_header',
    REMOVE_HEADER: 'client:remove_header',
    EXECUTE_REQUEST: 'client:execute_request', // "¡Fuego!" (Click en Send)
  },
  
  // Eventos que envía el SERVIDOR
  SERVER: {
    SYNC_STATE: 'server:sync_state',     // "Este es el estado actual de la sala"
    BROADCAST_FIELD: 'server:broadcast_field', // "Alguien cambió esto, actualízate"
    REQUEST_STARTED: 'server:request_started', // "Petición en curso..."
    REQUEST_COMPLETE: 'server:request_complete', // "Aquí tienes la respuesta"
    USER_COUNT: 'server:user_count',     // "Hay 3 usuarios conectados"
    ERROR: 'server:error'
  }
} as const;