import mongoose from "mongoose";
import { ApiConfig } from "../config/types";
import { Logger } from "../helpers/logger";


export function setupDbConnection(config: ApiConfig): void {
  try {
    const MONGO_URI = `mongodb://${config.db.user}:${config.db.password}@${config.host}:${config.db.port}/${config.db.name}`;
    // const MONGO_URI = `mongodb://${config.host}:${config.db.port}/${config.db.name}`;

    // console.log("MONGO_URI ==> ", MONGO_URI)
    mongoose.connect(MONGO_URI, { authMechanism: "DEFAULT" });
    Logger.info("Connection to db successfull");
  } catch (error) {
    throw new Error(`Connection to db failed ${error}`);
  }
}