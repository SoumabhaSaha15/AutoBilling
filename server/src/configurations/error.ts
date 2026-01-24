import z from "zod";
import { MongoServerError } from "mongodb";
import ResponseError from "../utility/response-error.js";
import { Request, Response, NextFunction } from "express";
export default async (err: Error, _: Request, res: Response, __: NextFunction) => {
  if (err instanceof z.ZodError) {
    console.log(z.prettifyError(err));
    return void res.status(400).send('Invalid format');
  }
  else if (err instanceof MongoServerError) {
    const { errmsg, message } = err.errorResponse;
    return void res.status(400).send(message || errmsg);
  }
  else if (err instanceof ResponseError) return void res.status(err.statusCode).send(err.message);
  else res.status(500).send(err.message);
}
