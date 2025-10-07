import { z, ZodError as v4Error  } from "zod/v4";
import { ZodError as v3Error } from "zod/v3";
import { MongoServerError } from "mongodb";
import { Request, Response, NextFunction } from "express";
export default async (err: Error, _: Request, res: Response, __: NextFunction) => {
  console.error(err);
  if (err instanceof v4Error || err instanceof v3Error) res.status(400).send(z.prettifyError(err));
  else if (err instanceof MongoServerError) {
    const { errmsg,message } = err.errorResponse;
    res.status(400).send(message||errmsg);
  }
  else res.status(500).send(err.message);
}
