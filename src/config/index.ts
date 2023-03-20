import { boolValOrUndef, numberVal, numberValOrUndef, strVal, strValOrUndef } from "../helpers/data-type-helper";
import { Logger } from "../helpers/logger";
import { ApiConfig } from "./types";


export let apiConfig: ApiConfig;

export function setupApiConfig(env: NodeJS.ProcessEnv): void {
  Logger.info("==> SETUP API CONFIG START");

  apiConfig = {
    host: strValOrUndef(env["API_HOST"]) ?? "localhost",
    port: numberValOrUndef(env["API_PORT"]) ?? 4400,
    jwtSecret: strVal(env["JWT_SECRET"]),
    sessionSecret: strVal(env["SESSION_SECRET"]),
    environment: env["NODE_ENV"] === "prod" ? "prod" : "dev",
    apiUrl: env["API_URL"],
    ssl: boolValOrUndef(env["SSL"]) ?? false,
    db: {
      name: strVal(env["DATABASE_NAME"]),
      rootPassword: strVal(env["DATABASE_PASSWORD"]),
      user: strVal(env["DATABASE_USERNAME"]),
      password: strVal(env["DATABASE_PASSWORD"]),
      port: numberVal(env["DATABASE_PORT"]),
    },
    mail: {
      host: strVal(env["MAIL_HOST"]),
      port: numberVal(env["MAIL_PORT"]),
      authUser: strVal(env["MAIL_AUTH_USER"]),
      authUserPassword: strVal(env["MAIL_AUTH_PASS"]),
    },
  }
  Logger.info("==> API CONFIG LOADED");
}