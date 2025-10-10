import express from "express";
const GET = {
  destroySession: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.session.clientId) return void res.status(401).send('No cookie found.');
    return void req.session.destroy((err) => {
      if (err) return void next(err);
      res.clearCookie('connect.sid');
      res.status(200).send('Logged out successfully.');
    });
  }
}

export default GET;
