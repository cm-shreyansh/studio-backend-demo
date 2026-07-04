import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

import env from './environment.js';

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(pool);

export default db;

// class Database {
//   value: string;
//   constructor(text: string) {
//     this.value = text;
//   }
// }

// export default Database;
