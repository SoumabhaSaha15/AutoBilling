import express from 'express';
import { Request } from 'express';
declare global {
  namespace Express {
    interface Request {
      clientId:string|null;
      clientType:'admin'|'employee'|null;
    }
  }
}
