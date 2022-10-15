import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { encryptPassword, verifyPassword } from './utils';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare password
    const passwordMatches = await verifyPassword(user.hash, password);

    if (!passwordMatches) throw new ForbiddenException('Credentials incorrect');

    delete user.hash;
    return { user };
  }

  async createUser(email: string, password: string, username = '') {
    try {
      // generate password hash
      const hash = await encryptPassword(password);

      const user = await this.prisma.user.create({
        data: {
          email,
          hash,
          username: username || email.split('@')[0],
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

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;

    // compare password
    const passwordMatches = await verifyPassword(user.hash, password);

    if (!passwordMatches) return null;

    delete user.hash;
    return user.id;
  }

  findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
