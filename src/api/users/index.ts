import bcrypt from "bcrypt";
import { Request, Response } from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import { hashPassword, jwtSign, verifyPassword } from "../../helpers/auth";
import { ResponseCode, writeError, writeJsonResponse } from "../../helpers/express-utils";
import { Logger } from "../../helpers/logger";
import { IUser, User } from "./model";


passport.use("local", new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
  async (email: string, password: string, done) => {
    try {
      const user: IUser | null = await User.findOne({ email });


      if (!user || !await bcrypt.compare(password, user.password)) {
        return done(null, false, {
          message: "Email or password incorrect"
        })
      }
      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }));

passport.serializeUser((user: IUser, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});


async function getUserByEmail(email: string): Promise<IUser> {
  const rows: IUser = await User.findOne({ "email": email });

  if (!rows) return;

  return rows;
}

export async function getUserById(userId: string): Promise<IUser> {
  
  const user: IUser | null = await User.findById(userId);

  if (!user) throw new Error(`Unknown user with id ${userId}`);

  return user;
}

async function getPassword(userId: string): Promise<string> {
  const user: IUser | null = await User.findById(userId);

  if (!user)
    throw new Error(`Unknown user with id ${userId}`);

  return user.password
}

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { firstname, lastname, email, password } = req.body;


    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      writeError(res, ResponseCode.exception48, "Email already exist");
      return;
    }

    const passwordHash = await hashPassword(password);

    const newUser = new User({
      email,
      password: passwordHash,
      firstname,
      lastname,
      createdAt: new Date().toLocaleDateString()
    });

    const saved = await newUser.save();
    if (!saved) {
      writeError(res, ResponseCode.exception48, "Add user failed");
      return;
    }

    const id = saved._id.toString();

    const token = await jwtSign({ userId: id }, undefined);
    const getUser = await getUserById(id);

    writeJsonResponse(res, {
      jwt: token,
      data: {
        firstname: getUser.firstname,
        lastname: getUser.lastname,
        email: getUser.email
      }
    });
  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48, error.message)
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user as IUser;

    const token = await jwtSign({ userId: user._id }, undefined);

    writeJsonResponse(res, {
      jwt: token,
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }
    });


  } catch (error) {
    Logger.error(error.toString());
    writeError(res, ResponseCode.exception48)
  }
}

/* function dbDataToUserCollection(row: IUser): UserCollection{
  return {
    _id: strVal(row.id),
    firstname: strVal(row.firstname),
    lastname: strVal(row.lastname),
    email: strVal(row.)
  }
} */