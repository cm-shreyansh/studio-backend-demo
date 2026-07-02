import AuthRepository from '../repository/auth.repository.ts';
class AuthService {
  //   authRepository: AuthRepository;
  private authRepository: AuthRepository;
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async login(email: string, password: string) {
    //find user
    const user = await this.authRepository.findUserByEmail(email);
    //if user exists, check password
    //if password matches, generate JWT token
    //return token
  }
}

export default AuthService;
