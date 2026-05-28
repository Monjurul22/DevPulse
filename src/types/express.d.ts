import { Request } from "express";

export interface AuthPayload {
  id:   number;
  name: string;
  role: "contributor" | "maintainer";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

