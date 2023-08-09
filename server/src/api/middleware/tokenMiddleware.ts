import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_KEY = process.env.JWT_KEY || "key";

export default function tokenAuthorizer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    res.status(401).json({ error: "TOKEN NOT FOUND" });
    return;
  }

  const token = bearerToken.split(" ")[1];
  if (!token) {
    res.status(403).json({ error: "BAD TOKEN" });
    return;
  }
  jwt.verify(token, JWT_KEY, (err, user) => {
    if (err) {
      res.status(401).json({ error: "INVALID TOKEN" });
      return;
    }
    // @ts-ignore Passing user token
    req["user"] = user;
    console.log("TOKEN AUHTORIZED");
    next();
  });
}
