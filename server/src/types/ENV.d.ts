declare namespace NodeJS {
  interface ProcessEnv {
    DB_URI: string;
    PORT: number;
    JWT_KEY:string;
  }
}
