interface DbConfig {
  user: string;
  password: string;
  name: string;
  rootPassword: string;
  port: number;
}

export interface MailConfig {
  host: string
  port: number
  authUser: string
  authUserPassword: string
}

export interface ApiConfig {
  host: string;
  port: number;
  jwtSecret: string;
  sessionSecret: string,
  environment: "dev" | "prod";
  ssl: boolean
  apiUrl?: string
  frontendUrl?: string

  db: DbConfig;
  mail: MailConfig
}