import express from "express";
const GET = { getCsrfToken: async (req: express.Request, res: express.Response) => void res.status(200).send(req.csrfToken()) };
export default GET;
