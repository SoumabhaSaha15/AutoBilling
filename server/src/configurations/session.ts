import session from "express-session";
import MongoStore from "connect-mongo";
const sessionConfig = () => {
  const sessionStore = MongoStore.create({
    mongoUrl: process.env.DB_URI,
    collectionName: 'sessions', // Sessions will be stored here
    ttl: 60 * 60 * 24 * 7, // 7 day
    autoRemove:"native"
  });
  return session({
    // Use a secure key, e.g., your existing JWT_KEY
    secret: process.env.JWT_KEY || 'a_strong_fallback_secret',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true
    },
  });
}
export default sessionConfig;
