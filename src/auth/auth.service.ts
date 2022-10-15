import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  signIn(dto: AuthDto) {
    return this.userService.findUser(dto.email, dto.password);
  }

  signUp(dto: AuthDto) {
    return this.userService.createUser(dto.email, dto.password, dto.username);
  }

  validateUser(email: string, password: string) {
    return this.userService.validateUser(email, password);
  }
}
