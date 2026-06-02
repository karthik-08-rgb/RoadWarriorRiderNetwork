import { Request, Response, NextFunction } from "express";

export function adminAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const password = req.headers["x-admin-password"];

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  next();
}