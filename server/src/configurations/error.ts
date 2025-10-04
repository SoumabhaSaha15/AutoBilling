import { z, ZodError } from "zod/v4";
import { MongoServerError } from "mongodb";
import { Request, Response, NextFunction } from "express";
export default async (err: Error, _: Request, res: Response, __: NextFunction) => {
  console.error(err);
  if (err instanceof ZodError) res.status(400).send(z.prettifyError(err));
  else if (err instanceof MongoServerError) {
    const { keyValue } = err.errorResponse;
    const errorMessage = Object.entries(keyValue).map(el => `${el[0]} : ${el[1]} is already in use.`).join(" ");
    res.status(400).send(errorMessage);
  }
  else res.status(500).send(err.message);
}
