import { migrate } from 'drizzle-orm/mysql2/migrator';
import db from '../../config/database.js';

async function main() {
  await migrate(db, {
    migrationsFolder: './src/database/drizzle/migrations',
  });

  console.log('Migration completed');
}

main().catch(console.error);
