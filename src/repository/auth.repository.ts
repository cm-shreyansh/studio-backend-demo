import { eq } from 'drizzle-orm';

import db from '../config/database.js';
import { users } from '../database/drizzle/schema/user.schema.js';

class AuthRepository {
  // Find user by email
  async findUserByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));

    return result[0] ?? null;
  }

  // Check if user exists
  async userExists(email: string) {
    const user = await this.findUserByEmail(email);

    return !!user;
  }

  // Create user
  async createUser(user: {
    id: string;
    email: string;
    passwordHash: string;
    displayName: string;
  }) {
    await db.insert(users).values({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      displayName: user.displayName,
      createdAt: new Date(),
    });

    return user;
  }
}

export default AuthRepository;
