import { csrfSync } from "csrf-sync";
export const { generateToken, csrfSynchronisedProtection } = csrfSync({ getTokenFromRequest: (req) => req.headers["x-csrf-token"] as string });
