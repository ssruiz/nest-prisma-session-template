import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super();
  }

  serializeUser(userId: number, done: (err, userId: number) => void) {
    done(null, userId);
  }

  async deserializeUser(userId: number, done: (err, userId: number) => void) {
    console.log('userId', userId);
    const userDb = await this.userService.findUserById(userId);

    if (userDb) return done(null, userId);

    return done(null, null);
  }
}
