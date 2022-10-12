import { ForbiddenException, Injectable } from '@nestjs/common';

import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(
    private _prismaService: PrismaService,
    private config: ConfigService,
  ) {}

  async signIn(dto: AuthDto) {
    // find user
    const user = await this._prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare password
    const passwordMatches = await argon.verify(user.hash, dto.password);

    if (!passwordMatches) throw new ForbiddenException('Credentials incorrect');

    delete user.hash;
    return { user };
  }

  async signUp(dto: AuthDto) {
    try {
      // generate password hash
      const hash = await argon.hash(dto.password);

      const user = await this._prismaService.user.create({
        data: {
          email: dto.email,
          hash,
          username: dto.username || dto.email,
        },
      });

      delete user.hash;
      return { user };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ForbiddenException('Credentials taken');

      console.log('here');
      throw error;
    }
  }
}
