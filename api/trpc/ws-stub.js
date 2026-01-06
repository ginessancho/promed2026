// Stub for WebSocket - we only use HTTP client, not WebSocket
// This is replaced at build time to avoid bundling ws and its Node.js dependencies

export class WebSocket {
  constructor() {
    throw new Error("WebSocket is not supported in this serverless environment. Use HTTPS URLs instead of libsql:// or wss://");
  }
}

// Export all expected symbols as undefined/stubs
export const CONNECTING = 0;
export const OPEN = 1;
export const CLOSING = 2;
export const CLOSED = 3;

export default WebSocket;

