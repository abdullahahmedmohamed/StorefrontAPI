declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      APP_PORT: string;
      DB_HOST: string;
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_PORT: string;
      Test_DB_Name: string;
      PASSWORD_PEPPER: string;
      SALT_ROUND: string;
      JWT_KEY: string;
    }
  }
}

export {};
