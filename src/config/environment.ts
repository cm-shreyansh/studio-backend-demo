import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const environment = process.env.NODE_ENV || 'development';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, `../../.env.${environment}`),
});

export default {
  NODE_ENV: environment,

  PORT: process.env.PORT ? parseInt(process.env.PORT) : 4000,

  // MySQL
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD ?? '',
  DB_NAME: process.env.DB_NAME!,

  PEER_PORT: process.env.PEER_PORT ? parseInt(process.env.PEER_PORT) : 9000,

  JWT_SECRET: process.env.JWT_SECRET!,

  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  FROM_EMAIL: process.env.FROM_EMAIL!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
};
