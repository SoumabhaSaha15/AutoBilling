import { ZodError as v4Error } from "zod/v4";
import { ZodError as v3Error } from "zod/v3";
import { MongoServerError } from "mongodb";
import { Request, Response, NextFunction } from "express";
import ResponseError from "../utility/response-error";
export default async (err: Error, _: Request, res: Response, __: NextFunction) => {
  console.error(err.message);
  if (err instanceof v4Error || err instanceof v3Error)
    return void res.status(400).send('Invalid format');
  else if (err instanceof MongoServerError) {
    const { errmsg, message } = err.errorResponse;
    return void res.status(400).send(message || errmsg);
  }
  else if (err instanceof ResponseError) return void res.status(err.statusCode).send(err.message);
  else res.status(500).send(err.message);
}
