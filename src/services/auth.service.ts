import bcrypt from 'bcrypt';
import crypto from 'crypto';

import AuthRepository from '../repository/auth.repository.ts';

class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async signup(displayName: string, email: string, password: string) {
    // Check if user already exists
    const existingUser = await this.authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.authRepository.createUser({
      id: crypto.randomUUID(),
      displayName,
      email,
      passwordHash,
    });

    // Remove passwordHash before sending response
    const { passwordHash: _, ...safeUser } = user;

    return safeUser;
  }

  async login(email: string, password: string) {
    // Find user
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Remove passwordHash before sending response
    const { passwordHash: _, ...safeUser } = user;

    return safeUser;
  }
}

export default AuthService;
