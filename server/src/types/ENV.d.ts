declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    DB_URI: string;
    JWT_KEY: string;
    CORS_URL: string;
    ADMIN_KEY: string;
    CLOUDINARY_ENV_VAR: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_ADMIN_DIR: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_SECRET: string;
  }
}
