import { io, type Socket } from 'socket.io-client';

/* ─────────────────────────────────────────────
   Backend Socket.IO events (from src/config/socket.ts)
   ──────────────────────────────────────────── */
export type ServerToClientEvents = {
  // Fired when org updates an application status — targets user:{userId} room
  'application:status_updated': (data: {
    applicationId: string;
    jobId: string;
    jobTitle: string;
    companyName: string;
    oldStatus: string;
    newStatus: string;
    updatedAt: string;
  }) => void;

  // Fired when a user applies — targets org:{orgId} room
  'application:new': (data: {
    applicationId: string;
    jobId: string;
    jobTitle: string;
    applicantName: string;
    appliedAt: string;
  }) => void;

  // Fired when user withdraws — targets org:{orgId} room
  'application:withdrawn': (data: {
    applicationId: string;
    jobId: string;
    jobTitle: string;
    applicantName: string;
  }) => void;

  // Fired when org marks candidate as HIRED — targets org:{orgId} room
  'incentive:created': (data: {
    incentiveId: string;
    amount: number;
    candidateName: string;
    jobTitle: string;
    dueAt: string;
  }) => void;

  // Fired for any new notification — targets user:{userId} or org:{orgId}
  'notification:new': (data: {
    id: string;
    type: string;
    message: string;
    createdAt: string;
  }) => void;
};

/* ── Socket singleton ── */
let socket: Socket<ServerToClientEvents> | null = null;

export function getSocket(): Socket<ServerToClientEvents> | null {
  return socket;
}

export function connectSocket(): Socket<ServerToClientEvents> {
  if (socket?.connected === true) return socket;

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    withCredentials: true, // Send HttpOnly auth cookies
    transports: ['websocket'], // Skip long-polling
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => {
    console.info('socket connected');
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      // Server disconnected us (e.g. auth expired) — don't auto-reconnect
      socket?.connect();
    }
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket !== null) {
    socket.disconnect();
    socket = null;
  }
}
