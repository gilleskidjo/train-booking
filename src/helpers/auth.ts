import bcrypt from "bcrypt";
import { apiConfig } from "../config";
import jwt from "jsonwebtoken";
import { getUserById } from "../api/users";
import { Request } from "express";

interface TokenContent {
  userId: string;
}

export async function hashPassword(password: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return reject(err);
      }
      resolve(hash);
    });
  });
}

export function jwtSign(payload: TokenContent, expiresIn: undefined): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, apiConfig.jwtSecret, expiresIn ? { expiresIn } : {},
      (error, token) => {
        if (error) reject(error);
        else {
          if (token === undefined) reject("Missing encoded JWT token");
          else resolve(token);
        }
      })
  })
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

function jwtVerify(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, apiConfig.jwtSecret, (error, decoded) => {
      if (error) reject(error);
      else resolve(decoded);
    });
  });
}


export async function decodeToken(token: string): Promise<TokenContent> {
  const info = await jwtVerify(token);
  // console.log("info ==> ", info);


  if (!info.userId)
    throw new Error("Invalid token provided");

  return {
    userId: info.userId
  };
}

export async function checkSession(req: Request) {
  // console.log("req ==> ", req.headers?.authorization?.slice(7));

  const authToken = req.headers?.authorization?.slice(7);
  // console.log("authToken  => ", authToken);


  if (!authToken) {
    throw new Error("Missing auth token");
  }

  const { userId } = await decodeToken(authToken);

  if (!userId)
    throw new Error("Invalid auth token provided");

  return await getUserById(userId);
}