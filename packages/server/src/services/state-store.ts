import { IRoomState, IRequestData, IResponseData, IKeyValue, HttpMethod } from '@proxymity/shared';

const DEFAULT_REQUEST: IRequestData = {
  method: 'GET',
  url: '',
  headers: [],
  queryParams: [],
  body: '{}'
};

class StateStore {
  // In-memory storage (Map<RoomID, RoomState>)
  // In the future, this would be replaced by Redis calls
    
  private rooms = new Map<string, IRoomState>();

  public getOrCreateRoom(roomId: string): IRoomState {
    if (!this.rooms.has(roomId)) {
      console.log(`[Store] Initializing new room: ${roomId}`);
      this.rooms.set(roomId, {
        id: roomId,
        request: { ...DEFAULT_REQUEST },
        response: null,
        activeUsers: 0,
        isLoading: false
      });
    }
    return this.rooms.get(roomId)!;
  }

  public updateUserCount(roomId: string, count: number) {
    const room = this.getOrCreateRoom(roomId);
    room.activeUsers = count;
    return room;
  }

  public updateMethod(roomId: string, method: HttpMethod) {
    const room = this.getOrCreateRoom(roomId);
    
    const validMethods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    if (validMethods.includes(method)) {
      room.request.method = method;
    } else {
      console.warn(`[Store] Invalid method '${method}' ignored for room ${roomId}`);
    }
    return room;
  }

  public updateUrl(roomId: string, url: string) {
    const room = this.getOrCreateRoom(roomId);
    
    if (typeof url === 'string') {
      const trimmedUrl = url.trim();

      if (!trimmedUrl) {
        console.warn(`[Store] Empty URL ignored for room ${roomId}`);
        return room;
      }

      try {
        // Validate that the URL is well-formed (includes scheme, etc.)
        // This will throw if the URL is malformed.
        new URL(trimmedUrl);
        room.request.url = trimmedUrl.slice(0, 2048);
      } catch {
        console.warn(`[Store] Invalid URL '${url}' ignored for room ${roomId}`);
      }
    }
    return room;
  }

  public updateBody(roomId: string, body: string) {
    const room = this.getOrCreateRoom(roomId);
    
    if (typeof body === 'string') {
      if (body.length > 100_000) { // Limit ~100KB
        console.warn(`[Store] Body too large rejected for room ${roomId}`);
        return room;
      }
      room.request.body = body;
    }
    return room;
  }

  public updateKeyValueList(roomId: string, type: 'headers' | 'queryParams', list: IKeyValue[]) {
    const room = this.getOrCreateRoom(roomId);
    
    if (Array.isArray(list)) {
      let trimmedList = list;
      if (list.length > 50) {
        console.warn(`[Store] Too many ${type} items, trimming list.`);
        trimmedList = list.slice(0, 50);
      }
      room.request[type] = trimmedList;
    }
    return room;
  }

  public setLoading(roomId: string, isLoading: boolean) {
    const room = this.getOrCreateRoom(roomId);
    room.isLoading = isLoading;
    return room;
  }

  public setResponse(roomId: string, response: IResponseData | null) {
    const room = this.getOrCreateRoom(roomId);
    room.response = response;
    room.isLoading = false;
    return room;
  }
}

export const stateStore = new StateStore();