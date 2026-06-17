import 'express';
declare module 'express-session' {
  interface SessionData {
    clientId?: string;
    clientType?: 'admin' | 'employee';
  }
}

// import 'express';

declare global {
  namespace Express {
    interface Request {
      csrfToken: () => string;
    }
  }
}
