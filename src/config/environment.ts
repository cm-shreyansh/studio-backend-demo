import path from 'path';

import dotEnv from 'dotenv';
import { fileURLToPath } from 'url';

const environment = process.env.NODE_ENV || 'development';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

dotEnv.config({ path: path.resolve(__dirname, `../../.env.${environment}`) });

export default {
  NODE_ENV: environment,
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 4000,
  DB_URL: process.env.MONGODB_URI,
  PEER_PORT: process.env.PEER_PORT ? parseInt(process.env.PEER_PORT) : 9000,
  APP_SECRET: process.env.APP_SECRET,
  WEB_DIST_PATH: path.resolve(__dirname, '../../../web/dist'),
};
